import { useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

type ColorMode = 'light' | 'dark';

const COLOR_MODE_KEY = 'constructrack-theme';

export function useColorMode() {
  const [storedMode, setStoredMode] = useLocalStorage<ColorMode | null>(COLOR_MODE_KEY, null);
  const [mode, setMode] = useState<ColorMode>(() => {
    if (storedMode) return storedMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const handleSystemThemeChange = useCallback((e: MediaQueryListEvent) => {
    if (!storedMode) {
      setMode(e.matches ? 'dark' : 'light');
    }
  }, [storedMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [handleSystemThemeChange]);

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      setStoredMode(newMode);
      return newMode;
    });
  }, [setStoredMode]);

  return { mode, toggleColorMode };
}