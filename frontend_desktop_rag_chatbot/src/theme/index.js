/**
 * Ocean Professional Theme Provider and tokens
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Ocean Professional design tokens
 * Note: values are reflected to CSS variables by ThemeProvider for usage in plain CSS.
 */
export const tokens = {
  colors: {
    primary: '#2563EB',   // blue-600
    secondary: '#F59E0B', // amber-500
    success: '#F59E0B',   // using amber as success accent per request
    error: '#EF4444',     // red-500
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    borderLight: 'rgba(17,24,39,0.10)',
    gradientStart: 'rgba(59,130,246,0.10)', // blue-500/10
    gradientEnd: '#f9fafb',                 // gray-50
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 },
  radius: { sm: 6, md: 10, lg: 14, xl: 18, pill: 9999 },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 10px rgba(0,0,0,0.08)',
    lg: '0 10px 20px rgba(0,0,0,0.10)',
    inset: 'inset 0 1px 2px rgba(0,0,0,0.06)',
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    codeFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    baseSize: 16,
    scale: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
  },
};

const DARK_SCHEME = {
  background: '#0b1220',
  surface: '#0f172a',
  text: '#e5e7eb',
  border: 'rgba(148,163,184,0.24)',
};

const ThemeContext = createContext({
  // PUBLIC_INTERFACE
  theme: 'light',
  // PUBLIC_INTERFACE
  setTheme: (_mode) => {},
  // PUBLIC_INTERFACE
  tokens,
});

// PUBLIC_INTERFACE
export function useTheme() {
  /** Use theme state and tokens */
  return useContext(ThemeContext);
}

// PUBLIC_INTERFACE
export function ThemeProvider({ initialTheme = 'light', children }) {
  /**
   * Provides theme state, applies CSS variables, and respects prefers-color-scheme.
   * Defaults to light; reads the user preference for dark only as a hint when
   * initialTheme is not provided explicitly.
   */
  const systemPrefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useState(initialTheme || (systemPrefersDark ? 'dark' : 'light'));

  // Reflect theme and tokens into :root CSS variables for global CSS usage
  useEffect(() => {
    const root = document.documentElement;

    // Set data-theme attribute for CSS hooks
    root.setAttribute('data-theme', theme);

    // core color variables for both themes
    const c = tokens.colors;
    const isDark = theme === 'dark';

    const background = isDark ? DARK_SCHEME.background : c.background;
    const surface = isDark ? DARK_SCHEME.surface : c.surface;
    const text = isDark ? DARK_SCHEME.text : c.text;
    const border = isDark ? DARK_SCHEME.border : c.borderLight;

    root.style.setProperty('--color-primary', c.primary);
    root.style.setProperty('--color-secondary', c.secondary);
    root.style.setProperty('--color-success', c.success);
    root.style.setProperty('--color-error', c.error);
    root.style.setProperty('--color-background', background);
    root.style.setProperty('--color-surface', surface);
    root.style.setProperty('--color-text', text);
    root.style.setProperty('--color-border', border);
    root.style.setProperty('--gradient-start', c.gradientStart);
    root.style.setProperty('--gradient-end', c.gradientEnd);

    // spacing
    Object.entries(tokens.spacing).forEach(([k, v]) =>
      root.style.setProperty(`--space-${k}`, `${v}px`)
    );
    // radius
    Object.entries(tokens.radius).forEach(([k, v]) =>
      root.style.setProperty(`--radius-${k}`, `${v}px`)
    );
    // shadows
    Object.entries(tokens.shadows).forEach(([k, v]) =>
      root.style.setProperty(`--shadow-${k}`, v)
    );
    // typography
    root.style.setProperty('--font-family', tokens.typography.fontFamily);
    root.style.setProperty('--font-family-code', tokens.typography.codeFamily);
    Object.entries(tokens.typography.scale).forEach(([k, v]) =>
      root.style.setProperty(`--font-size-${k}`, `${v}px`)
    );
  }, [theme]);

  // Dark-mode readiness hook (no-op by default)
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      // kept as readiness only; no automatic switch
    };
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const value = useMemo(() => ({ theme, setTheme, tokens }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
