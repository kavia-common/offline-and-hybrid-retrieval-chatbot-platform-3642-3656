import React from 'react';

// PUBLIC_INTERFACE
export default function MainChatPane() {
  /** Main chat pane; placeholder content for future steps. */
  return (
    <section className="main-chat-pane" aria-label="Main chat area">
      <div className="chat-header">
        <h2 className="m-0">Conversation</h2>
        <p className="muted">Ask questions about your documents. UI wiring coming in next steps.</p>
      </div>

      <div className="chat-body surface">
        <div className="message system">
          <div className="bubble">
            <strong>Welcome!</strong>
            <p className="m-0">Start chatting once sources are connected. This is a placeholder.</p>
          </div>
        </div>
        <div className="message user">
          <div className="bubble">How do I connect my local PDFs?</div>
        </div>
        <div className="message assistant">
          <div className="bubble">
            Use the “Sources” tab to add folders or files. Detailed controls arrive in step 04.00.
          </div>
        </div>
      </div>

      <div className="chat-input surface">
        <input className="input" type="text" placeholder="Type your prompt..." aria-label="Prompt input" />
        <button className="btn">Send</button>
      </div>
    </section>
  );
}
