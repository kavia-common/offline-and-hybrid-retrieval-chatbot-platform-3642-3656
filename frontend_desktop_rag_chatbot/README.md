# Lightweight React + Electron Template for KAVIA

This project provides a minimal React template wrapped with Electron for desktop development, with a clean, modern UI and minimal dependencies.

## Features

- **Electron Dev Wiring**: Start CRA and Electron together for desktop dev
- **Secure Preload**: contextIsolation with a minimal `window.api` surface
- **IPC Scaffolding**: Stubs for settings and offline/hybrid toggles, TODOs for RAG/LLM
- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs CRA in development mode and launches Electron to load it.  
Electron opens automatically after the dev server is ready.

### `npm run start:web`

Runs the web app only (without Electron).  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run start:prod-electron`

Runs Electron against the local production build (requires `npm run build` first).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.  
Electron will load `build/index.html` when started via `npm run start:prod-electron`.

## Preload API

The Electron preload exposes a minimal API at `window.api`:

- `getSettings(): Promise<Settings & { offlineMode: boolean }>`
- `setSettings(partial: object): Promise<{ success: boolean, settings: object }>`
- `toggleOfflineMode(): Promise<{ success: boolean, offlineMode: boolean }>`
- `getAppInfo(): Promise<{ name, version, isDev, platform, env }>`

Future RAG/LLM operations will extend this API (see TODOs in electron/preload.js and electron/main.js).

## Env Vars

Optionally uses existing `REACT_APP_*` variables:
- `REACT_APP_API_BASE`, `REACT_APP_BACKEND_URL`, `REACT_APP_WS_URL`, `REACT_APP_NODE_ENV`, `REACT_APP_FEATURE_FLAGS`, etc.

These are not required for dev wiring to function.

## Notes

- Packaging is not configured yet (dev only).
- The preload uses contextIsolation and avoids nodeIntegration for security.
