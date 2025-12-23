import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function ChatComposer({ onSend, disabled }) {
  /**
   * Chat composer with textarea and send button.
   * Enter sends, Shift+Enter inserts newline. Disabled during streaming.
   */
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSend();
    }
  };

  const triggerSend = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend?.(text);
    setValue('');
  };

  // Focus the input when enabled after stream finishes
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div className="chat-input surface">
      <textarea
        ref={textareaRef}
        className="input composer-input"
        placeholder={disabled ? 'Receiving reply…' : 'Type your prompt (Shift+Enter for newline)…'}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Prompt input"
      />
      <button
        className="btn"
        onClick={triggerSend}
        disabled={disabled || !value.trim()}
        aria-disabled={disabled || !value.trim()}
        title="Send message"
      >
        Send
      </button>
    </div>
  );
}
