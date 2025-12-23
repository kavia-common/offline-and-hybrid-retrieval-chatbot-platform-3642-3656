const { contextBridge, ipcRenderer } = require('electron');

const CHANNELS = {
  GET_SETTINGS: 'app:getSettings',
  SET_SETTINGS: 'app:setSettings',
  TOGGLE_OFFLINE_MODE: 'app:toggleOfflineMode',
  GET_APP_INFO: 'app:getAppInfo',
  GET_MODE: 'app:getMode',
  SET_MODE: 'app:setMode',
  PICK_FILES: 'app:pickFiles',
  PICK_FOLDER: 'app:pickFolder',
  // TODO: 'rag:query', 'rag:index', 'retrieval:config', 'llm:invoke'
};

/**
 * Safe invoker to protect against channel mismatch errors.
 * Returns undefined on failure.
 */
function safeInvoke(channel, ...args) {
  try {
    return ipcRenderer.invoke(channel, ...args);
  } catch {
    return Promise.resolve(undefined);
  }
}

// PUBLIC_INTERFACE
contextBridge.exposeInMainWorld('api', {
  /**
   * Returns current settings and offline mode.
   * @returns {Promise<{offlineMode: boolean, apiBase?: string, backendUrl?: string, wsUrl?: string, env?: string, featureFlags?: string}>}
   */
  getSettings: () => safeInvoke(CHANNELS.GET_SETTINGS),

  /**
   * Partially update settings.
   * @param {Object} partial
   * @returns {Promise<{success: boolean, settings: Object}>}
   */
  setSettings: (partial) => safeInvoke(CHANNELS.SET_SETTINGS, partial),

  /**
   * Toggle offline/hybrid mode.
   * @returns {Promise<{success: boolean, offlineMode: boolean}>}
   */
  toggleOfflineMode: () => safeInvoke(CHANNELS.TOGGLE_OFFLINE_MODE),

  /**
   * Get app metadata useful for UI.
   * @returns {Promise<{name: string, version: string, isDev: boolean, platform: string, env: string}>}
   */
  getAppInfo: () => safeInvoke(CHANNELS.GET_APP_INFO),

  /**
   * Get current mode (offline|hybrid).
   * @returns {Promise<{mode: 'offline' | 'hybrid'}>}
   */
  getMode: () => safeInvoke(CHANNELS.GET_MODE),

  /**
   * Set current mode.
   * @param {'offline'|'hybrid'} mode
   * @returns {Promise<{success: boolean, mode: 'offline' | 'hybrid'}>}
   */
  setMode: (mode) => safeInvoke(CHANNELS.SET_MODE, mode),

  /**
   * Open file picker (stubbed).
   * @param {{filters?: Array<{name: string; extensions: string[] }>, allowMultiple?: boolean}} options
   * @returns {Promise<{canceled: boolean, filePaths: string[]}>}
   */
  pickFiles: (options = {}) => safeInvoke(CHANNELS.PICK_FILES, options),

  /**
   * Open folder picker (stubbed).
   * @returns {Promise<{canceled: boolean, filePaths: string[]}>}
   */
  pickFolder: () => safeInvoke(CHANNELS.PICK_FOLDER),

  // TODO Future public methods:
  // ragQuery: (payload) => ipcRenderer.invoke('rag:query', payload),
  // ragIndex: (payload) => ipcRenderer.invoke('rag:index', payload),
  // configureRetrieval: (payload) => ipcRenderer.invoke('retrieval:config', payload),
  // llmInvoke: (payload) => ipcRenderer.invoke('llm:invoke', payload),
});
