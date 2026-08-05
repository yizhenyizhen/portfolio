import "server-only";

const DEFAULT_AI_MODEL = "gpt-5-mini";

export const aiServerConfig = {
  model: process.env.OPENAI_MODEL?.trim() || DEFAULT_AI_MODEL,
  requestTimeoutMs: 30_000,
  maxOutputTokens: 350,
  rateLimit: {
    maxConcurrent: 2,
    maxRequests: 10,
    windowMs: 60 * 60_000,
  },
} as const;
