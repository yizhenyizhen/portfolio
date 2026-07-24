import "server-only";

import type {
  KnowledgeContext,
  KnowledgeProvider,
} from "@/lib/knowledge/types";

export class EmptyKnowledgeProvider implements KnowledgeProvider {
  async retrieve(): Promise<KnowledgeContext> {
    return {
      text: "",
      citations: [],
    };
  }
}
