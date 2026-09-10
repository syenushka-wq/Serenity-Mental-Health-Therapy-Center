import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D9488', // Serene Deep Teal
      light: '#14B8A6',
      dark: '#0F766E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4F46E5', // Slate Indigo
      light: '#6366F1',
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',
      light: '#D1FAE5',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
    },
    error: {
      main: '#EF4444',
      light: '#FEE2E2',
    },
    info: {
      main: '#0284C7',
      light: '#E0F2FE',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      disabled: '#94A3B8',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
  },
});

export default theme;
