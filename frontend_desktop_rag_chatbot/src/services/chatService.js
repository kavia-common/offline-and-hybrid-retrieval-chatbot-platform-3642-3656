//
// Chat service abstraction prepared for future IPC wiring to window.api
//

/**
 * Simple delay helper
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// PUBLIC_INTERFACE
export async function sendUserMessage(text) {
  /**
   * Sends a user message. Currently a mock that just resolves.
   * TODO: Wire to window.api.llmInvoke or ragQuery when backend/IPC is ready.
   */
  // Placeholder no-op; in future we may persist or notify Electron main process
  await sleep(10);
  return { success: true };
}

// PUBLIC_INTERFACE
export async function streamAssistantReply(onChunk) {
  /**
   * Streams assistant reply chunks. This is a mock implementation that emits chunks with delays.
   * @param {(chunk: string) => void} onChunk - callback invoked for each text chunk
   * @returns {Promise<void>}
   *
   * TODO: Replace with window.api.llmInvoke({stream: true}) once available.
   */
  const chunks = [
    "Sure, I can help with that. ",
    "Here are a few steps to get you started:\n",
    "1) Organize your sources in a folder.\n",
    "2) Use the Sources tab to ingest files.\n",
    "3) Ask a question—I'll retrieve the most relevant passages.\n\n",
    "This is a mocked streaming reply for now."
  ];
  for (const c of chunks) {
    await sleep(180);
    onChunk(c);
  }
}
