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

  const toggleColorMode = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setStoredMode(newMode);
  }, [mode, setStoredMode]);

  useEffect(() => {
    // Apply the theme class to the root element
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return { mode, toggleColorMode };
}