import React from 'react';

// PUBLIC_INTERFACE
export default function ChatStatusBar({ isStreaming, tokensUsed, latencyMs }) {
  /**
   * Minimal status bar showing placeholder metrics.
   * Values are placeholders until wired to real backend.
   */
  return (
    <div className="chat-status muted" aria-live="polite">
      <span>Tokens: {tokensUsed ?? '—'}</span>
      <span className="sep">•</span>
      <span>Latency: {latencyMs != null ? `${latencyMs} ms` : '—'}</span>
      <span className="sep">•</span>
      <span>Status: {isStreaming ? 'Streaming…' : 'Idle'}</span>
    </div>
  );
}
