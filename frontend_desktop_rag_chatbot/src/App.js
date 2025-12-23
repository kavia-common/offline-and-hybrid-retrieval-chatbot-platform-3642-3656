import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [offline, setOffline] = useState(null);
  const [appInfo, setAppInfo] = useState(null);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
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
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>

        {typeof window !== 'undefined' && window.api ? (
          <>
            <p>
              Offline mode: <strong>{offline === null ? 'unknown' : (offline ? 'enabled' : 'disabled')}</strong>
            </p>
            <button className="theme-toggle" onClick={toggleOfflineMode}>
              Toggle Offline
            </button>
            {appInfo && (
              <p className="App-link" style={{ marginTop: 12 }}>
                Electron {appInfo.version} • {appInfo.isDev ? 'Development' : 'Production'} • {appInfo.platform}
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
