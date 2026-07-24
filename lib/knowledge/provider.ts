import "server-only";

import type OpenAI from "openai";
import { EmptyKnowledgeProvider } from "./empty-provider";
import { OpenAIFileSearchKnowledgeProvider } from "./openai-file-search-provider";
import type { KnowledgeProvider } from "./types";

export function createKnowledgeProvider(client: OpenAI): KnowledgeProvider {
  const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID?.trim();

  return vectorStoreId
    ? new OpenAIFileSearchKnowledgeProvider(client, vectorStoreId)
    : new EmptyKnowledgeProvider();
}
