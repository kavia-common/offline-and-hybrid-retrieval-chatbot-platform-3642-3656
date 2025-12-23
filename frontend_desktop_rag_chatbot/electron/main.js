const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Basic channel name registry for future RAG/LLM operations
const CHANNELS = {
  GET_SETTINGS: 'app:getSettings',
  SET_SETTINGS: 'app:setSettings',
  TOGGLE_OFFLINE_MODE: 'app:toggleOfflineMode',
  GET_APP_INFO: 'app:getAppInfo',
  // TODO: Add RAG/LLM channels:
  // 'rag:query', 'rag:index', 'rag:ingest', 'llm:invoke', 'retrieval:config',
};

let mainWindow = null;

// In-memory placeholder app state/settings for dev scaffolding
const appState = {
  offlineMode: false,
  settings: {
    apiBase: process.env.REACT_APP_API_BASE || '',
    backendUrl: process.env.REACT_APP_BACKEND_URL || '',
    wsUrl: process.env.REACT_APP_WS_URL || '',
    env: process.env.REACT_APP_NODE_ENV || (isDev ? 'development' : 'production'),
    featureFlags: process.env.REACT_APP_FEATURE_FLAGS || '',
  },
};

// PUBLIC_INTERFACE
function createMainWindow() {
  /**
   * Create the main application BrowserWindow and load content.
   * - In development: waits for CRA dev server at localhost:3000
   * - In production: loads local index.html from the build folder
   * Returns the created BrowserWindow.
   */
  const preloadPath = path.join(__dirname, 'preload.js');

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#f9fafb',
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: isDev,
    },
  });

  win.on('ready-to-show', () => {
    win.show();
    if (isDev) {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });

  if (isDev) {
    const devURL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
    win.loadURL(devURL);
  } else {
    const indexPath = path.join(__dirname, '..', 'build', 'index.html');
    win.loadFile(indexPath);
  }

  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
}

// App lifecycle
app.on('ready', () => {
  mainWindow = createMainWindow();

  // macOS specific
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, apps typically remain active until Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle(CHANNELS.GET_SETTINGS, async () => {
  return { ...appState.settings, offlineMode: appState.offlineMode };
});

ipcMain.handle(CHANNELS.SET_SETTINGS, async (_event, partialSettings = {}) => {
  appState.settings = {
    ...appState.settings,
    ...partialSettings,
  };
  return { success: true, settings: appState.settings };
});

ipcMain.handle(CHANNELS.TOGGLE_OFFLINE_MODE, async () => {
  appState.offlineMode = !appState.offlineMode;
  return { success: true, offlineMode: appState.offlineMode };
});

ipcMain.handle(CHANNELS.GET_APP_INFO, async () => {
  return {
    name: app.getName(),
    version: app.getVersion(),
    isDev,
    platform: process.platform,
    env: appState.settings.env,
  };
});

// TODO RAG/LLM IPC stubs (implementation to be added in future tasks):
// ipcMain.handle('rag:query', async (_event, { prompt, options }) => {/* ... */});
// ipcMain.handle('rag:index', async (_event, { sourcePath, options }) => {/* ... */});
// ipcMain.handle('retrieval:config', async (_event, { pipeline }) => {/* ... */});
// ipcMain.handle('llm:invoke', async (_event, { model, input, params }) => {/* ... */});
