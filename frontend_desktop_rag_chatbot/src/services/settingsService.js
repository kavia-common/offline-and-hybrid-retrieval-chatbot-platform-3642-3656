//
// Settings service: provides a simple API to persist and retrieve user configuration.
// Data is stored in localStorage for persistence and optionally bridged to Electron via window.api.
//
const STORAGE_KEY = 'rag_desktop_settings_v1';

const DEFAULT_SETTINGS = {
  llm: {
    provider: 'OpenAI', // OpenAI, Anthropic, Local (GGUF), Ollama
    model: 'gpt-3.5-turbo',
    temperature: 0.2,
    maxTokens: 1024,
  },
  retrieval: {
    topK: 5,
    chunkSize: 800,
    chunkOverlap: 150,
    reranking: false,
  },
  dataSources: {
    items: [], // [{ id, path, type: 'folder'|'file' }]
  },
  // mirrors electron basic settings for future merge; not user-facing in modals for now
  apiBase: '',
  backendUrl: '',
  wsUrl: '',
  featureFlags: '',
  env: '',
  offlineMode: false,
};

// Normalize numeric fields and provide clamps
function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

// PUBLIC_INTERFACE
export function getDefaultSettings() {
  /** Return a deep clone of defaults */
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

// PUBLIC_INTERFACE
export function loadSettings() {
  /**
   * Load settings from localStorage, falling back to defaults.
   * If Electron window.api.getSettings exists, we merge non-empty Electron fields on first load.
   */
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let settings = raw ? JSON.parse(raw) : getDefaultSettings();

    // best-effort merge from electron's minimal settings once
    if (typeof window !== 'undefined' && window.api?.getSettings && !settings.__mergedElectron) {
      // Note: this call is async; we return current settings immediately,
      // but also arrange an async merge that writes back. Callers can refresh if needed.
      window.api.getSettings().then((s) => {
        if (!s || typeof s !== 'object') return;
        const merged = {
          ...settings,
          apiBase: s.apiBase ?? settings.apiBase,
          backendUrl: s.backendUrl ?? settings.backendUrl,
          wsUrl: s.wsUrl ?? settings.wsUrl,
          featureFlags: s.featureFlags ?? settings.featureFlags,
          env: s.env ?? settings.env,
          offlineMode: s.offlineMode ?? settings.offlineMode,
          __mergedElectron: true,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }).catch(() => {});
    }

    return settings;
  } catch {
    return getDefaultSettings();
  }
}

// PUBLIC_INTERFACE
export function saveSettings(partial) {
  /**
   * Merge partial settings and persist to localStorage.
   * Also forwards a minimal subset to Electron via window.api.setSettings (fire-and-forget).
   */
  const current = loadSettings();
  const next = {
    ...current,
    ...('llm' in partial ? { llm: { ...current.llm, ...partial.llm } } : {}),
    ...('retrieval' in partial ? { retrieval: { ...current.retrieval, ...partial.retrieval } } : {}),
    ...('dataSources' in partial ? { dataSources: { ...current.dataSources, ...partial.dataSources } } : {}),
    ...('apiBase' in partial ? { apiBase: partial.apiBase } : {}),
    ...('backendUrl' in partial ? { backendUrl: partial.backendUrl } : {}),
    ...('wsUrl' in partial ? { wsUrl: partial.wsUrl } : {}),
    ...('featureFlags' in partial ? { featureFlags: partial.featureFlags } : {}),
    ...('env' in partial ? { env: partial.env } : {}),
    ...('offlineMode' in partial ? { offlineMode: !!partial.offlineMode } : {}),
  };

  // Coerce numeric values to valid ranges
  next.llm.temperature = clampNumber(next.llm.temperature, 0, 2, DEFAULT_SETTINGS.llm.temperature);
  next.llm.maxTokens = clampNumber(next.llm.maxTokens, 1, 32768, DEFAULT_SETTINGS.llm.maxTokens);
  next.retrieval.topK = clampNumber(next.retrieval.topK, 1, 100, DEFAULT_SETTINGS.retrieval.topK);
  next.retrieval.chunkSize = clampNumber(next.retrieval.chunkSize, 64, 8000, DEFAULT_SETTINGS.retrieval.chunkSize);
  next.retrieval.chunkOverlap = clampNumber(next.retrieval.chunkOverlap, 0, Math.max(0, next.retrieval.chunkSize - 1), DEFAULT_SETTINGS.retrieval.chunkOverlap);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // fail silently
  }

  if (typeof window !== 'undefined' && window.api?.setSettings) {
    const minimal = {
      apiBase: next.apiBase,
      backendUrl: next.backendUrl,
      wsUrl: next.wsUrl,
      featureFlags: next.featureFlags,
      env: next.env,
    };
    window.api.setSettings(minimal).catch(() => {});
  }
  return next;
}

// PUBLIC_INTERFACE
export function subscribeSettings(handler) {
  /**
   * Subscribe to storage changes (cross-tab or same tab writes).
   * Returns an unsubscribe function.
   */
  const fn = (e) => {
    if (e.key === STORAGE_KEY) {
      try {
        const val = e.newValue ? JSON.parse(e.newValue) : getDefaultSettings();
        handler(val);
      } catch {
        handler(getDefaultSettings());
      }
    }
  };
  window.addEventListener('storage', fn);
  return () => window.removeEventListener('storage', fn);
}
