import { useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useMediaQuery } from '@mui/material';

type ColorMode = 'light' | 'dark';

const COLOR_MODE_KEY = 'constructrack-theme';

export function useColorMode() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [storedMode, setStoredMode] = useLocalStorage<ColorMode>(
    COLOR_MODE_KEY,
    prefersDarkMode ? 'dark' : 'light'
  );

  useEffect(() => {
    // Update theme on system preference change
    setStoredMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode, setStoredMode]);

  useEffect(() => {
    // Apply theme class to document body
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${storedMode}-mode`);
    
    // Apply theme class to html element for Tailwind dark mode
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(storedMode);
    
    // Update color scheme
    root.style.colorScheme = storedMode;
  }, [storedMode]);

  const toggleColorMode = () => {
    setStoredMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return { mode: storedMode, toggleColorMode };
}