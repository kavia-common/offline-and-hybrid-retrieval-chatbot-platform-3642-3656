import React from 'react';
import { useTheme } from '../../theme';

// PUBLIC_INTERFACE
export default function TopBar({ onToggleTheme, currentTheme, onToggleSidebar, offline, onToggleOffline }) {
  /** TopBar with app title and quick actions; Ocean Professional styling */
  return (
    <header className="topbar surface" aria-label="Application top bar">
      <div className="left">
        <button
          className="icon-btn"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          title="Toggle sidebar"
        >
          ☰
        </button>
        <div className="title">
          <span className="brand-dot" aria-hidden="true" />
          <strong>RAG Desktop</strong>
          <span className="subtitle"> • Ocean Professional</span>
        </div>
      </div>

      <div className="actions">
        {typeof window !== 'undefined' && window.api && (
          <button className="btn ghost" onClick={onToggleOffline}>
            {offline ? 'Disable Offline' : 'Enable Offline'}
          </button>
        )}
        <button
          className="btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
        >
          {currentTheme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
}
