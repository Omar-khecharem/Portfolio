import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themeApi, themesApi } from '../services/api';

const ThemeContext = createContext();

const FALLBACK = {
  colors: { primary: '#0a0a23', secondary: '#1a1a3e', accent: '#e94560', base: '#f5f5f0', surface: '#eae8e4', text: '#16161a', textMuted: '#6e7a8a', line: '#d8d6d0' },
  spacing: { section: 120 },
  hero: { backgroundType: 'gradient', gradientStart: '#0a0a23', gradientEnd: '#1a1a3e', overlay: 0.6 },
};

function injectCSS(t) {
  const r = document.documentElement;
  const c = t.colors || FALLBACK.colors;
  r.style.setProperty('--clr-primary', c.primary);
  r.style.setProperty('--clr-secondary', c.secondary);
  r.style.setProperty('--clr-accent', c.accent);
  r.style.setProperty('--clr-base', c.base);
  r.style.setProperty('--clr-surface', c.surface);
  r.style.setProperty('--clr-text', c.text);
  r.style.setProperty('--clr-text-muted', c.textMuted);
  r.style.setProperty('--clr-line', c.line);
  r.style.setProperty('--sp-section', `${t.spacing?.section || 120}px`);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadActive = useCallback(() => {
    setLoading(true);
    themeApi.getActive()
      .then((t) => { setTheme(t); injectCSS(t); })
      .catch(() => { setTheme(FALLBACK); injectCSS(FALLBACK); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadActive(); }, [loadActive]);

  const update = useCallback(async (data) => {
    if (!theme?._id) return;
    const updated = await themeApi.update(theme._id, data);
    setTheme(updated);
    injectCSS(updated);
    return updated;
  }, [theme]);

  const activate = useCallback(async (id) => {
    const activated = await themesApi.activate(id);
    setTheme(activated);
    injectCSS(activated);
    return activated;
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, loading, update, activate }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
