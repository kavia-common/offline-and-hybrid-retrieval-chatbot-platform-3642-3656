import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/layout.css';
import { useTheme } from './theme';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import MainChatPane from './components/layout/MainChatPane';
import LLMSelectionModal from './components/modals/LLMSelectionModal';
import RetrievalSettingsModal from './components/modals/RetrievalSettingsModal';
import DataSourcesModal from './components/modals/DataSourcesModal';
import { loadSettings, subscribeSettings } from './services/settingsService';

// PUBLIC_INTERFACE
function App() {
  const { theme, setTheme } = useTheme();
  const [offline, setOffline] = useState(null);
  const [appInfo, setAppInfo] = useState(null);

  // local UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('sources'); // 'sources' | 'settings'

  // modals
  const [llmOpen, setLlmOpen] = useState(false);
  const [retrievalOpen, setRetrievalOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // reflect selected settings into status bar in chat
  const [settingsSnapshot, setSettingsSnapshot] = useState(loadSettings());

  useEffect(() => {
    // If running under Electron, load settings/app info
    if (typeof window !== 'undefined' && window.api) {
      window.api.getSettings?.().then((s) => {
        if (s && typeof s.offlineMode === 'boolean') setOffline(s.offlineMode);
      }).catch(() => {});
      window.api.getMode?.().then((m) => {
        if (m && m.mode) setOffline(m.mode === 'offline');
      }).catch(() => {});
      window.api.getAppInfo?.().then(setAppInfo).catch(() => {});
    }
    // subscribe to localStorage changes
    const unsub = subscribeSettings((s) => setSettingsSnapshot(s));
    return () => unsub?.();
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleOfflineMode = async () => {
    // Prefer setMode to explicitly choose next mode
    if (window.api?.getMode && window.api?.setMode) {
      try {
        const m = await window.api.getMode();
        const next = m?.mode === 'offline' ? 'hybrid' : 'offline';
        const res = await window.api.setMode(next);
        if (res && typeof res.mode === 'string') {
          setOffline(res.mode === 'offline');
        }
        return;
      } catch {
        // fallback below
      }
    }
    if (window.api?.toggleOfflineMode) {
      try {
        const result = await window.api.toggleOfflineMode();
        if (result && typeof result.offlineMode === 'boolean') {
          setOffline(result.offlineMode);
        }
      } catch {
        // noop
      }
    }
  };

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className="app-shell">
      <TopBar
        onToggleTheme={toggleTheme}
        currentTheme={theme}
        onToggleSidebar={toggleSidebar}
        offline={offline}
        onToggleOffline={toggleOfflineMode}
        onOpenLLM={() => setLlmOpen(true)}
        onOpenRetrieval={() => setRetrievalOpen(true)}
        onOpenSources={() => setSourcesOpen(true)}
      />
      <Sidebar
        activeTab={activeSidebarTab}
        setActiveTab={setActiveSidebarTab}
        visible={sidebarOpen}
      />
      <MainChatPane
        settingsSummary={{
          provider: settingsSnapshot?.llm?.provider,
          model: settingsSnapshot?.llm?.model,
          topK: settingsSnapshot?.retrieval?.topK,
          reranking: settingsSnapshot?.retrieval?.reranking,
        }}
      />

      <LLMSelectionModal open={llmOpen} onClose={() => { setLlmOpen(false); setSettingsSnapshot(loadSettings()); }} />
      <RetrievalSettingsModal open={retrievalOpen} onClose={() => { setRetrievalOpen(false); setSettingsSnapshot(loadSettings()); }} />
      <DataSourcesModal open={sourcesOpen} onClose={() => { setSourcesOpen(false); setSettingsSnapshot(loadSettings()); }} />
    </div>
  );
}

export default App;
