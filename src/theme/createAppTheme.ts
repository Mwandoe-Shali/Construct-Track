import { Theme, createTheme } from '@mui/material/styles';
import { colors } from './colors';

export function createAppTheme(mode: 'light' | 'dark'): Theme {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light' 
        ? {
            primary: {
              main: colors.sepia[700],
              light: colors.sepia[500],
              dark: colors.sepia[800],
            },
            background: {
              default: colors.sepia[50],
              paper: '#FFFFFF',
            },
            text: {
              primary: colors.sepia[900],
              secondary: colors.sepia[800],
            },
          }
        : {
            primary: {
              main: colors.sepia[400],
            },
            background: {
              default: colors.dark.background,
              paper: colors.dark.paper,
            },
            divider: colors.dark.border,
          }),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? colors.sepia[700] : colors.dark.paper,
            transition: 'background-color 0.2s ease-in-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
          },
        },
      },
    },
  });
}