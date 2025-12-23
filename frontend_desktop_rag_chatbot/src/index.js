import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Optional: log Electron app info in dev if available
if (typeof window !== 'undefined' && window.api && typeof window.api.getAppInfo === 'function') {
  window.api.getAppInfo().then((info) => {
    // eslint-disable-next-line no-console
    console.log('Electron App Info:', info);
  }).catch(() => {});
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
