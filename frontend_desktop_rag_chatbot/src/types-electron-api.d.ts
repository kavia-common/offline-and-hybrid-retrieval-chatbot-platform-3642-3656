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
  };
}
