import type { AIStreamEvent } from "./client-types";

const EVENT_SEPARATOR = "\n\n";

export function encodeAIStreamEvent(event: AIStreamEvent) {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}${EVENT_SEPARATOR}`;
}

export function consumeAIStreamBuffer(buffer: string) {
  const normalized = buffer.replaceAll("\r\n", "\n");
  const blocks = normalized.split(EVENT_SEPARATOR);
  const remainder = blocks.pop() ?? "";
  const events: AIStreamEvent[] = [];

  for (const block of blocks) {
    const data = block
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");

    if (!data) continue;

    try {
      const parsed = JSON.parse(data) as AIStreamEvent;
      if (
        parsed.type === "delta" ||
        parsed.type === "done" ||
        parsed.type === "error"
      ) {
        events.push(parsed);
      }
    } catch {
      // A malformed server event is ignored; stream completion is validated by
      // the caller so a broken response still becomes a controlled UI error.
    }
  }

  return { events, remainder };
}
