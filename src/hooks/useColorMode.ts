import { useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useMediaQuery } from '@mui/material';

type ColorMode = 'light' | 'dark';

const COLOR_MODE_KEY = 'constructrack-theme';

export function useColorMode() {
  const [mode, setMode] = useLocalStorage<ColorMode>(
    'color-mode',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

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
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newMode);
      return newMode;
    });
  };

  return { mode, toggleColorMode };
}