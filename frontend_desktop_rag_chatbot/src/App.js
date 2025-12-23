import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useTheme } from './theme';

// PUBLIC_INTERFACE
function App() {
  const { theme, setTheme } = useTheme();
  const [offline, setOffline] = useState(null);
  const [appInfo, setAppInfo] = useState(null);

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

  return (
    <div className="App">
      <header className="App-header surface">
        <div className="top-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          {typeof window !== 'undefined' && window.api && (
            <button className="btn ghost" onClick={toggleOfflineMode}>
              {offline ? 'Disable Offline' : 'Enable Offline'}
            </button>
          )}
        </div>

        <img src={logo} className="App-logo" alt="logo" />
        <h1>Ocean Professional</h1>
        <p className="container">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>

        {typeof window !== 'undefined' && window.api ? (
          <>
            <p>
              Offline mode:{' '}
              <strong>{offline === null ? 'unknown' : offline ? 'enabled' : 'disabled'}</strong>
            </p>
            {appInfo && (
              <p className="App-link" style={{ marginTop: 12 }}>
                Electron {appInfo.version} • {appInfo.isDev ? 'Development' : 'Production'} •{' '}
                {appInfo.platform}
              </p>
            )}
          </>
        ) : (
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        )}
      </header>
    </div>
  );
}

export default App;
