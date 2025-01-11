import { useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

type ColorMode = 'light' | 'dark';

const COLOR_MODE_KEY = 'constructrack-theme';

export function useColorMode() {
  const [storedMode, setStoredMode] = useLocalStorage<ColorMode>(
    COLOR_MODE_KEY,
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [mode, setMode] = useState<ColorMode>(storedMode);

  // Apply theme immediately when mode changes
  useEffect(() => {
    document.documentElement.style.setProperty('color-scheme', mode);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);
    
    // Force immediate re-render of MUI components
    window.dispatchEvent(new Event('storage'));
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? 'dark' : 'light';
      setMode(newMode);
      setStoredMode(newMode);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setStoredMode]);

  const toggleColorMode = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setStoredMode(newMode);
  }, [mode, setStoredMode]);

  return { mode, toggleColorMode };
}