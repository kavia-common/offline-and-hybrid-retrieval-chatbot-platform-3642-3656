import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/layout.css';
import { useTheme } from './theme';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import MainChatPane from './components/layout/MainChatPane';

// PUBLIC_INTERFACE
function App() {
  const { theme, setTheme } = useTheme();
  const [offline, setOffline] = useState(null);
  const [appInfo, setAppInfo] = useState(null);

  // local UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('sources'); // 'sources' | 'settings'

  useEffect(() => {
    // If running under Electron, load settings/app info
    if (typeof window !== 'undefined' && window.api) {
      window.api.getSettings?.().then((s) => {
        if (s && typeof s.offlineMode === 'boolean') setOffline(s.offlineMode);
      }).catch(() => {});
      window.api.getAppInfo?.().then(setAppInfo).catch(() => {});
    }
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleOfflineMode = async () => {
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
      />
      <Sidebar
        activeTab={activeSidebarTab}
        setActiveTab={setActiveSidebarTab}
        visible={sidebarOpen}
      />
      <MainChatPane />
    </div>
  );
}

export default App;
