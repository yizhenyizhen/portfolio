export type KnowledgeCitation = {
  id: string;
  title?: string;
  url?: string;
};

export type KnowledgeContext = {
  text: string;
  citations: KnowledgeCitation[];
};

export type KnowledgeRetrieveOptions = {
  signal?: AbortSignal;
};

export interface KnowledgeProvider {
  retrieve(
    query: string,
    options?: KnowledgeRetrieveOptions,
  ): Promise<KnowledgeContext>;
}
