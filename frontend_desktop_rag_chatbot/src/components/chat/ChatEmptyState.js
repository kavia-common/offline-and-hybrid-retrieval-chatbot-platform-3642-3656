import React from 'react';

// PUBLIC_INTERFACE
export default function ChatEmptyState() {
  /** Simple empty-state block for new conversations */
  return (
    <div className="empty-state">
      <h3>Welcome</h3>
      <p className="muted">Start by asking a question. Use the sidebar to connect sources.</p>
    </div>
  );
}
