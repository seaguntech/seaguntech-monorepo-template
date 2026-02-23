'use client';

import {
  type ReactNode,
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme !== 'system') {
    return theme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const applyThemeClass = (resolvedTheme: ResolvedTheme) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
};

const updateMetaThemeColor = (resolvedTheme: ResolvedTheme) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      resolvedTheme === 'dark' ? '#0f0f12' : '#ffffff',
    );
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = storedTheme ?? 'system';
    const initialResolvedTheme = resolveTheme(initialTheme);

    setThemeState(initialTheme);
    setResolvedTheme(initialResolvedTheme);
    applyThemeClass(initialResolvedTheme);
    updateMetaThemeColor(initialResolvedTheme);
  }, []);

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const onChange = () => {
      const nextResolvedTheme = media.matches ? 'dark' : 'light';
      setResolvedTheme(nextResolvedTheme);
      applyThemeClass(nextResolvedTheme);
      updateMetaThemeColor(nextResolvedTheme);
    };

    media.addEventListener('change', onChange);

    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setThemeState(nextTheme);

    const nextResolvedTheme = resolveTheme(nextTheme);
    setResolvedTheme(nextResolvedTheme);
    applyThemeClass(nextResolvedTheme);
    updateMetaThemeColor(nextResolvedTheme);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
