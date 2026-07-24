import "server-only";

const DEFAULT_AI_MODEL = "gpt-5.6-luna";

export const aiServerConfig = {
  model: process.env.OPENAI_MODEL?.trim() || DEFAULT_AI_MODEL,
  requestTimeoutMs: 55_000,
  maxOutputTokens: 1_200,
  rateLimit: {
    maxConcurrent: 2,
    maxRequests: 8,
    windowMs: 60_000,
  },
} as const;
