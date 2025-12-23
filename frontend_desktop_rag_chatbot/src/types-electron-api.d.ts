/* Ambient type declarations for the Electron preload API exposed on window.api */
declare interface Window {
  api?: {
    getSettings: () => Promise<{
      offlineMode: boolean;
      apiBase?: string;
      backendUrl?: string;
      wsUrl?: string;
      env?: string;
      featureFlags?: string;
    }>;
    setSettings: (partial: Record<string, unknown>) => Promise<{ success: boolean; settings: Record<string, unknown> }>;
    toggleOfflineMode: () => Promise<{ success: boolean; offlineMode: boolean }>;
    getAppInfo: () => Promise<{ name: string; version: string; isDev: boolean; platform: string; env?: string }>;

    // New stubs
    getMode: () => Promise<{ mode: 'offline' | 'hybrid' }>;
    setMode: (mode: 'offline' | 'hybrid') => Promise<{ success: boolean; mode: 'offline' | 'hybrid' }>;
    pickFiles: (options?: {
      filters?: Array<{ name: string; extensions: string[] }>;
      allowMultiple?: boolean;
    }) => Promise<{ canceled: boolean; filePaths: string[] }>;
    pickFolder: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  };
}
