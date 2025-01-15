import { ReactNode, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useColorMode } from '../hooks/useColorMode';
import { createAppTheme } from './createAppTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode } = useColorMode();

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove existing classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light-mode', 'dark-mode');

    // Add new classes
    root.classList.add(mode);
    body.classList.add(`${mode}-mode`);
    
    // Update color scheme
    root.style.colorScheme = mode;
  }, [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}