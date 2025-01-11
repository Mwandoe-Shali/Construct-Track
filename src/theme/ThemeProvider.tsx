import { ReactNode, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useColorMode } from '../hooks/useColorMode';
import { createAppTheme } from './createAppTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode } = useColorMode();
  const theme = createAppTheme(mode);

  useEffect(() => {
    // Apply theme class to document body
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);
    
    // Apply theme class to html element for Tailwind dark mode
    document.documentElement.classList.toggle('dark', mode === 'dark');
    
    // Update favicon color
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = favicon.href.split('?')[0] + '?color=' + (mode === 'dark' ? 'white' : 'black');
    }
  }, [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}