const { contextBridge, ipcRenderer } = require('electron');

const CHANNELS = {
  GET_SETTINGS: 'app:getSettings',
  SET_SETTINGS: 'app:setSettings',
  TOGGLE_OFFLINE_MODE: 'app:toggleOfflineMode',
  GET_APP_INFO: 'app:getAppInfo',
  // TODO: 'rag:query', 'rag:index', 'retrieval:config', 'llm:invoke'
};

// PUBLIC_INTERFACE
contextBridge.exposeInMainWorld('api', {
  /**
   * Returns current settings and offline mode.
   * @returns {Promise<{offlineMode: boolean, apiBase?: string, backendUrl?: string, wsUrl?: string, env?: string, featureFlags?: string}>}
   */
  getSettings: () => ipcRenderer.invoke(CHANNELS.GET_SETTINGS),

  /**
   * Partially update settings.
   * @param {Object} partial
   * @returns {Promise<{success: boolean, settings: Object}>}
   */
  setSettings: (partial) => ipcRenderer.invoke(CHANNELS.SET_SETTINGS, partial),

  /**
   * Toggle offline/hybrid mode.
   * @returns {Promise<{success: boolean, offlineMode: boolean}>}
   */
  toggleOfflineMode: () => ipcRenderer.invoke(CHANNELS.TOGGLE_OFFLINE_MODE),

  /**
   * Get app metadata useful for UI.
   * @returns {Promise<{name: string, version: string, isDev: boolean, platform: string, env: string}>}
   */
  getAppInfo: () => ipcRenderer.invoke(CHANNELS.GET_APP_INFO),

  // TODO Future public methods:
  // ragQuery: (payload) => ipcRenderer.invoke('rag:query', payload),
  // ragIndex: (payload) => ipcRenderer.invoke('rag:index', payload),
  // configureRetrieval: (payload) => ipcRenderer.invoke('retrieval:config', payload),
  // llmInvoke: (payload) => ipcRenderer.invoke('llm:invoke', payload),
});
