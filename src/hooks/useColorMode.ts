import { useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useMediaQuery } from '@mui/material';

type ColorMode = 'light' | 'dark';

const COLOR_MODE_KEY = 'constructrack-theme';

export function useColorMode() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useLocalStorage<ColorMode>(
    COLOR_MODE_KEY,
    prefersDarkMode ? 'dark' : 'light'
  );

  useEffect(() => {
    // Update theme on system preference change
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode, setMode]);

  useEffect(() => {
    // Apply theme class to document body
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);
    
    // Apply theme class to html element for Tailwind dark mode
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    
    // Update color scheme
    root.style.colorScheme = mode;
  }, [mode]);

  const toggleColorMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return { mode, toggleColorMode };
}