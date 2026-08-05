export const en = {
  metadata: {
    siteDescription:
      "A personal world organized around creation, collection, discovery, building, and connection.",
  },
  language: {
    navigationLabel: "Language selection",
    english: "EN",
    chinese: "中文",
    switchToEnglish: "Switch to English",
    switchToChinese: "切换为简体中文",
  },
  navigation: {
    identity: "Identity navigation",
    world: "World navigation",
    continueExploring: "Continue exploring",
    backToHome: "Back to home",
    chapters: "{world} chapters",
    homepageRing: "Homepage ring navigation",
    homepageWorlds: "Homepage worlds",
    selectedAction: "Selected action: {world}",
    previewChapters: "{world} chapters",
  },
  world: {
    comingSoon: "Coming soon",
    comingLater: "Coming later",
    contentFramework: "Content framework",
  },
  identity: {
    footerLabel: "Identity",
    visitZenFurniture: "Visit Zen Furniture",
  },
  home: {
    searchPlaceholder: "Ask anything about Yizhen...",
  },
  ai: {
    close: "Close AI workspace",
    workspaceLabel: "AI WORKSPACE",
    title: "Ask anything about Yizhen.",
    introduction:
      "The personal archive is still being connected. General questions are available now.",
    processing: "Considering the question...",
    questionLabel: "Ask a question",
    questionPlaceholder: "Ask anything about Yizhen...",
    stop: "Stop",
    stopLabel: "Stop generating answer",
    ask: "Ask",
    askLabel: "Submit question",
    keyboardHint: "Enter to ask · Shift + Enter for a new line",
    charactersRemaining: "{count} characters remaining",
    answerLabel: "AI answer",
    sources: "Sources",
    generationStopped: "Generation stopped.",
    retry: "Retry",
    newQuestion: "New question",
    tooManyQuestions:
      "Too many questions were sent recently. Please wait a moment.",
    notConnected:
      "The AI workspace is not connected yet. Please try again later.",
    serviceUnavailable: "The answer service is temporarily unavailable.",
    streamUnavailable: "The answer stream could not be opened.",
    answerEnded: "The answer ended unexpectedly. Please try again.",
    submittedAnnouncement: "Question submitted. Preparing an answer.",
    completeAnnouncement: "Answer complete.",
    stoppedAnnouncement: "Answer generation stopped.",
    errorAnnouncement: "Answer error. {message}",
  },
  roomKeys: {
    back: "Back to Room Keys",
    placeholderRecord: "Placeholder record",
    previous: "Previous",
    next: "Next",
    collection: "Room Key Collection",
    previousLabel: "Previous room key, {title}",
    nextLabel: "Next room key, {title}",
    viewLabel: "View {title}",
    instructions:
      "Drag to rotate the archive. Use the arrow keys to rotate when the archive is focused. Press Home to return to the starting position.",
    archiveLabel: "Interactive room key archive",
    recordsLabel: "{count} room key records",
    dragToRotate: "Drag to rotate",
    records: "{count} records",
    notFound: "Room key not found",
    metadataDescription: "Placeholder archive record for {title}.",
  },
  notFound: {
    eyebrow: "Not found",
    title: "This route is not part of the current product structure.",
    description:
      "The architecture is intentionally organized around five permanent worlds. Additional chapters should be registered within those worlds instead of creating unrelated top-level routes.",
    action: "Return to the site root",
  },
} as const;

export type Messages = StringShape<typeof en>;

type StringShape<T> = {
  [Key in keyof T]: T[Key] extends string
    ? string
    : T[Key] extends Record<string, unknown>
      ? StringShape<T[Key]>
      : never;
};
