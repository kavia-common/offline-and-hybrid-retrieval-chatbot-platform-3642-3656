import React, { useState } from 'react';
import { useTheme } from '../../theme';

// PUBLIC_INTERFACE
export default function TopBar({ onToggleTheme, currentTheme, onToggleSidebar, offline, onToggleOffline, onOpenLLM, onOpenRetrieval, onOpenSources }) {
  /** TopBar with app title and quick actions; Ocean Professional styling */
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleOpen = (type) => {
    setSettingsOpen(false);
    if (type === 'llm') onOpenLLM?.();
    if (type === 'retrieval') onOpenRetrieval?.();
    if (type === 'sources') onOpenSources?.();
  };

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
        <div className="settings-menu">
          <button
            className="icon-btn"
            aria-label="Open settings menu"
            onClick={() => setSettingsOpen((v) => !v)}
            title="Settings"
          >
            ⚙️
          </button>
          {settingsOpen && (
            <div className="menu surface" role="menu">
              <button className="menu-item" role="menuitem" onClick={() => handleOpen('llm')}>LLM Selection</button>
              <button className="menu-item" role="menuitem" onClick={() => handleOpen('retrieval')}>Retrieval Settings</button>
              <button className="menu-item" role="menuitem" onClick={() => handleOpen('sources')}>Data Sources</button>
            </div>
          )}
        </div>

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
