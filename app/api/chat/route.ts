import { handleChatRequest } from "@/lib/ai/chat-handler";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return handleChatRequest(request);
}
