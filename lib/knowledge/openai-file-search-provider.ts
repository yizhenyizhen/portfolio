import "server-only";

import type OpenAI from "openai";
import type {
  KnowledgeContext,
  KnowledgeProvider,
  KnowledgeRetrieveOptions,
} from "@/lib/knowledge/types";

const MAX_RESULTS = 4;
const MAX_CONTEXT_CHARACTERS = 12_000;

export class OpenAIFileSearchKnowledgeProvider
  implements KnowledgeProvider
{
  constructor(
    private readonly client: OpenAI,
    private readonly vectorStoreId: string,
  ) {}

  async retrieve(
    query: string,
    options?: KnowledgeRetrieveOptions,
  ): Promise<KnowledgeContext> {
    const results = await this.client.vectorStores.search(
      this.vectorStoreId,
      {
        query,
        max_num_results: MAX_RESULTS,
        rewrite_query: true,
      },
      { signal: options?.signal },
    );

    const citations = results.data.map((result) => ({
      id: result.file_id,
      title: result.filename,
    }));

    const text = results.data
      .flatMap((result) =>
        result.content.map(
          (content) => `[Source: ${result.filename}]\n${content.text}`,
        ),
      )
      .join("\n\n")
      .slice(0, MAX_CONTEXT_CHARACTERS);

    return { text, citations };
  }
}
