# AI Workspace Architecture

The homepage question arc opens the existing in-page grey workspace. The
homepage remains mounted behind the overlay; no chat route or client-side
OpenAI connection is created.

## Request Path

```text
Browser
  -> POST /api/ai
  -> optional KnowledgeProvider
  -> OpenAI Responses API
  -> normalized server-sent events
  -> AIWorkspace
```

The browser accepts only the internal stream protocol (`delta`, `done`, and
`error`). OpenAI's raw event format and server configuration never enter the
client bundle.

## Environment

Copy the variable names from `.env.example` into a local ignored environment
file or the production deployment settings:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
OPENAI_VECTOR_STORE_ID=
```

- `OPENAI_API_KEY` is required for live answers and must remain server-only.
- `OPENAI_MODEL` is optional. The centralized fallback is `gpt-5.6-luna`.
- `OPENAI_VECTOR_STORE_ID` is optional. Without it, the empty knowledge
  provider is used and the assistant states its personal-knowledge limits.

The application still builds without credentials. The route returns a
controlled `configuration_missing` response until `OPENAI_API_KEY` is set.

## Security Boundaries

- The client can submit only a question and an optional previous response ID.
- Model, instructions, output limit, retrieval provider, and tools remain
  server-controlled.
- Requests are same-origin JSON POSTs with body and question-length limits.
- Raw upstream errors, stack traces, secrets, prompts, and knowledge context
  are not returned or logged.
- Requests use a 55-second timeout and support browser/upstream abort.
- The current in-memory limiter allows eight requests per minute and two
  concurrent requests per warm server instance.

The limiter is intentionally replaceable. It reduces accidental abuse but is
not globally consistent across serverless instances. Replace the implementation
behind `acquireAIRateLimit` with a durable Vercel KV, Upstash, or equivalent
store before increasing public traffic.

## Knowledge Provider

`lib/knowledge` isolates retrieval from the route and UI:

- `EmptyKnowledgeProvider` returns no documents.
- `OpenAIFileSearchKnowledgeProvider` activates only when
  `OPENAI_VECTOR_STORE_ID` is configured.
- Retrieved text is delimited as untrusted context and cannot override the
  server instructions.
- Citations are normalized for the frontend even when the initial provider
  returns none.

Connecting a different retrieval service requires a new `KnowledgeProvider`,
not a workspace redesign.

## Streaming And Continuity

The server converts actual Responses API stream events into SSE. The client
batches incoming deltas to animation frames, preserving responsive typing
without remounting the visual scene. The most recent response ID is retained
only for the active page session and supports lightweight follow-up questions.
Closing or resetting the workspace clears continuity; no conversation is
persisted in local storage or a database.

## Strands

Strands is decorative and isolated below all text and controls. It uses one OGL
renderer, a capped device-pixel ratio, `ResizeObserver`, tab-visibility pause,
reduced-motion static rendering, and full cleanup on unmount. A restrained CSS
background remains if WebGL initialization fails.
