export const AI_QUESTION_MAX_LENGTH = 1_200;

export type AIInterfaceState =
  | "idle"
  | "focused"
  | "submitting"
  | "streaming"
  | "complete"
  | "error"
  | "aborted";

export type AICitation = {
  id: string;
  label: string;
  href?: string;
};

export type AIAnswer = {
  text: string;
  citations: AICitation[];
};

export type AIQuestionRequest = {
  question: string;
  conversationId?: string;
  previousResponseId?: string;
};

export type AIErrorCode =
  | "invalid_request"
  | "rate_limited"
  | "configuration_missing"
  | "upstream_unavailable"
  | "timeout"
  | "aborted"
  | "unknown_error";

export type AIStreamEvent =
  | {
      type: "delta";
      text: string;
    }
  | {
      type: "done";
      responseId: string;
      citations: AICitation[];
    }
  | {
      type: "error";
      code: AIErrorCode;
      message: string;
    };

export type AIErrorResponse = {
  error: {
    code: AIErrorCode;
    message: string;
  };
};
