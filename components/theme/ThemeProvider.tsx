'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'system' | 'light' | 'dark';
type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme; // resolvedTheme（実際に適用されているテーマ）
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  themeMode: 'system',
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 初回マウント時にlocalStorageから読み込む
    const savedThemeMode = (localStorage.getItem('themeMode') as ThemeMode) || 'system';
    setThemeModeState(savedThemeMode);

    let initialTheme: Theme;
    if (savedThemeMode === 'system') {
      initialTheme = getSystemTheme();
    } else {
      initialTheme = savedThemeMode;
    }

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    // OS設定の変更を監視（systemモード時のみ）
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (savedThemeMode === 'system') {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);

    let newTheme: Theme;
    if (mode === 'system') {
      newTheme = getSystemTheme();
    } else {
      newTheme = mode;
    }

    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    // systemモードの場合はlight/darkに切り替え
    if (themeMode === 'system') {
      const newMode: ThemeMode = theme === 'light' ? 'dark' : 'light';
      setThemeMode(newMode);
    } else {
      // light/darkモードの場合は反転
      const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
      setThemeMode(newMode);
    }
  };

  // マウント前は空のdivを返す（SSR時のハイドレーションエラーを防ぐ）
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
