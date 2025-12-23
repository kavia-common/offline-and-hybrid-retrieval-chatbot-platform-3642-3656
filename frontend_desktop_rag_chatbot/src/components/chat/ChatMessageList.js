import React, { useEffect, useMemo, useRef } from 'react';

/**
 * Format a timestamp into a human-readable time string.
 * @param {number} ts - epoch ms
 */
function formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/**
 * Group messages by contiguous role to visually cluster them.
 * @param {Array} messages
 */
function groupByRole(messages) {
  const groups = [];
  let current = null;
  messages.forEach((m) => {
    if (!current || current.role !== m.role) {
      current = { role: m.role, items: [m] };
      groups.push(current);
    } else {
      current.items.push(m);
    }
  });
  return groups;
}

// PUBLIC_INTERFACE
export default function ChatMessageList({ messages, isStreaming, pendingText }) {
  /**
   * Renders chat messages with role-based styling and timestamps.
   * Includes auto-scroll and per-message copy-to-clipboard.
   * Streaming state shows a blinking cursor.
   */
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on update
  useEffect(() => {
    // Smooth scroll unless user scrolled far up
    const el = containerRef.current;
    const nearBottom =
      el && el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: 'end' });
    }
  }, [messages, pendingText, isStreaming]);

  const groups = useMemo(() => groupByRole(messages), [messages]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Simple UX hint; in full app use toasts
    } catch {
      // swallow
    }
  };

  return (
    <div
      className="chat-body surface"
      ref={containerRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {groups.length === 0 && !pendingText && (
        <div className="empty-state">
          <h3>Start a new conversation</h3>
          <p className="muted">Ask anything about your connected sources.</p>
        </div>
      )}

      {groups.map((g, gi) => (
        <div key={`g-${gi}`} className={`message-group ${g.role}`}>
          {g.items.map((m) => (
            <div key={m.id} className={`message ${m.role}`}>
              <div className="bubble">
                <div className="bubble-tools">
                  <span className="timestamp">{formatTime(m.createdAt || Date.now())}</span>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(m.text || '')}
                    title="Copy message"
                    aria-label="Copy message"
                  >
                    ⧉
                  </button>
                </div>
                <div className="bubble-content">
                  <pre className="content-pre">{m.text}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {typeof pendingText === 'string' && pendingText.length > 0 && (
        <div className="message assistant">
          <div className="bubble">
            <div className="bubble-tools">
              <span className="timestamp">{formatTime(Date.now())}</span>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(pendingText)}
                title="Copy message"
                aria-label="Copy message"
              >
                ⧉
              </button>
            </div>
            <div className="bubble-content">
              <pre className="content-pre">
                {pendingText}
                {isStreaming && <span className="cursor">▋</span>}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
