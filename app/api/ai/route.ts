import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  AI_QUESTION_MAX_LENGTH,
  type AICitation,
  type AIErrorCode,
  type AIErrorResponse,
  type AIQuestionRequest,
  type AIStreamEvent,
} from "@/lib/ai/client-types";
import { acquireAIRateLimit } from "@/lib/ai/rate-limit";
import { aiServerConfig } from "@/lib/ai/server-config";
import { encodeAIStreamEvent } from "@/lib/ai/stream-protocol";
import { buildAIInstructions } from "@/lib/ai/system-instructions";
import { createKnowledgeProvider } from "@/lib/knowledge/provider";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 16_384;
const RESPONSE_ID_PATTERN = /^resp_[A-Za-z0-9_-]{1,180}$/;
const encoder = new TextEncoder();

function errorResponse(
  code: AIErrorCode,
  message: string,
  status: number,
  headers?: HeadersInit,
) {
  return NextResponse.json<AIErrorResponse>(
    { error: { code, message } },
    { status, headers },
  );
}

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "anonymous"
  );
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",")[0]
      ?.trim();
    const requestHost = forwardedHost || request.headers.get("host");
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const requestProtocol =
      forwardedProtocol || new URL(request.url).protocol.replace(":", "");

    return (
      Boolean(requestHost) &&
      originUrl.host === requestHost &&
      originUrl.protocol === `${requestProtocol}:`
    );
  } catch {
    return false;
  }
}

function normalizeRequest(value: unknown): AIQuestionRequest | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.question !== "string") return null;

  const question = candidate.question.trim();
  if (!question || question.length > AI_QUESTION_MAX_LENGTH) return null;

  const previousResponseId =
    typeof candidate.previousResponseId === "string" &&
    RESPONSE_ID_PATTERN.test(candidate.previousResponseId)
      ? candidate.previousResponseId
      : undefined;

  const conversationId =
    typeof candidate.conversationId === "string"
      ? candidate.conversationId.slice(0, 120)
      : undefined;

  return { question, previousResponseId, conversationId };
}

function toCitations(
  citations: Awaited<
    ReturnType<
      ReturnType<typeof createKnowledgeProvider>["retrieve"]
    >
  >["citations"],
): AICitation[] {
  return citations.map((citation) => ({
    id: citation.id,
    label: citation.title || "Personal archive",
    href: citation.url,
  }));
}

function safeEnqueue(
  controller: ReadableStreamDefaultController<Uint8Array>,
  event: AIStreamEvent,
) {
  try {
    controller.enqueue(encoder.encode(encodeAIStreamEvent(event)));
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return errorResponse(
      "invalid_request",
      "This request is not allowed.",
      403,
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return errorResponse(
      "invalid_request",
      "A JSON request body is required.",
      415,
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse(
      "invalid_request",
      "The question is too large.",
      413,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      "invalid_request",
      "The request body is not valid JSON.",
      400,
    );
  }

  const input = normalizeRequest(body);
  if (!input) {
    return errorResponse(
      "invalid_request",
      `Enter a question between 1 and ${AI_QUESTION_MAX_LENGTH} characters.`,
      400,
    );
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return errorResponse(
      "configuration_missing",
      "The AI workspace is not connected yet. Please try again later.",
      503,
    );
  }

  const lease = acquireAIRateLimit(getClientKey(request));
  if (!lease.allowed) {
    return errorResponse(
      "rate_limited",
      "Too many questions were sent recently. Please wait a moment.",
      429,
      { "Retry-After": String(lease.retryAfterSeconds) },
    );
  }

  const client = new OpenAI({ apiKey });
  const timeoutController = new AbortController();
  const timeout = setTimeout(
    () => timeoutController.abort("timeout"),
    aiServerConfig.requestTimeoutMs,
  );
  const signal = AbortSignal.any([
    request.signal,
    timeoutController.signal,
  ]);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const knowledge = await createKnowledgeProvider(client).retrieve(
          input.question,
          { signal },
        );
        const citations = toCitations(knowledge.citations);
        const responseStream = await client.responses.create(
          {
            model: aiServerConfig.model,
            instructions: buildAIInstructions(knowledge),
            input: input.question,
            previous_response_id: input.previousResponseId,
            max_output_tokens: aiServerConfig.maxOutputTokens,
            stream: true,
          },
          { signal },
        );

        let completed = false;

        for await (const event of responseStream) {
          if (event.type === "response.output_text.delta") {
            if (
              !safeEnqueue(controller, {
                type: "delta",
                text: event.delta,
              })
            ) {
              break;
            }
          } else if (event.type === "response.completed") {
            completed = true;
            safeEnqueue(controller, {
              type: "done",
              responseId: event.response.id,
              citations,
            });
          } else if (
            event.type === "response.failed" ||
            event.type === "response.incomplete" ||
            event.type === "error"
          ) {
            throw new Error("upstream_stream_failed");
          }
        }

        if (!completed && !signal.aborted) {
          safeEnqueue(controller, {
            type: "error",
            code: "upstream_unavailable",
            message: "The answer ended unexpectedly. Please try again.",
          });
        }
      } catch (error) {
        const timeoutTriggered = timeoutController.signal.aborted;
        const requestAborted = request.signal.aborted;

        if (!requestAborted) {
          safeEnqueue(controller, {
            type: "error",
            code: timeoutTriggered ? "timeout" : "upstream_unavailable",
            message: timeoutTriggered
              ? "The request took too long. Please try again."
              : "The answer service is temporarily unavailable.",
          });
        }

        if (process.env.NODE_ENV === "development") {
          const name = error instanceof Error ? error.name : "UnknownError";
          console.error(`[ai-route] ${name}`);
        }
      } finally {
        clearTimeout(timeout);
        lease.release();
        try {
          controller.close();
        } catch {
          // The browser may have already closed the stream after aborting.
        }
      }
    },
    cancel() {
      timeoutController.abort("client_disconnected");
      clearTimeout(timeout);
      lease.release();
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
