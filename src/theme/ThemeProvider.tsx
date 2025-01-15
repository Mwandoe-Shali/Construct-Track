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

  // Memoize theme creation to prevent unnecessary re-renders
  const theme = useMemo(() => createAppTheme(mode), [mode]);

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
    
    // Update favicon color
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      const color = mode === 'dark' ? 'white' : 'black';
      const newHref = favicon.href.split('?')[0] + `?color=${color}&t=${Date.now()}`;
      favicon.href = newHref;
    }
  }, [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}