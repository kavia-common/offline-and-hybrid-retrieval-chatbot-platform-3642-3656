import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({ activeTab, setActiveTab, visible }) {
  /** Sidebar with tabs for Sources and Settings; collapsible. */
  return (
    <aside
      className={`sidebar surface ${visible ? 'open' : 'closed'}`}
      aria-label="Sidebar with sources and settings"
    >
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
          aria-selected={activeTab === 'sources'}
          role="tab"
        >
          Sources
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          aria-selected={activeTab === 'settings'}
          role="tab"
        >
          Settings
        </button>
      </div>

      <div className="sidebar-content" role="tabpanel">
        {activeTab === 'sources' ? (
          <div className="placeholder">
            <h3>Data Sources</h3>
            <p className="muted">Connect local folders, PDFs, or APIs. Coming in steps 04.00+</p>
            <ul className="bullets">
              <li>Local filesystem ingestion</li>
              <li>Embeddings index status</li>
              <li>Sync & refresh controls</li>
            </ul>
          </div>
        ) : (
          <div className="placeholder">
            <h3>Settings</h3>
            <p className="muted">Configure LLMs, retrieval, and hybrid mode. Coming in steps 05.00+</p>
            <ul className="bullets">
              <li>LLM provider and model</li>
              <li>Retrieval pipeline configuration</li>
              <li>Performance & privacy options</li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
