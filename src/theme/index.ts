import { createTheme, ThemeOptions } from '@mui/material/styles';

// Government portal color palette
const colors = {
  primary: {
    main: '#0052CC',
    light: '#4C8DE9',
    dark: '#003D99',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#36B37E',
    light: '#5DD9A0',
    dark: '#268557',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F4F6F8',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#172B4D',
    secondary: '#6B778C',
  },
  error: {
    main: '#DE350B',
    light: '#FF5630',
    dark: '#BF2600',
  },
  warning: {
    main: '#FFAB00',
    light: '#FFE380',
    dark: '#FF8B00',
  },
  success: {
    main: '#36B37E',
    light: '#57D9A3',
    dark: '#00875A',
  },
  info: {
    main: '#0052CC',
    light: '#4C8DE9',
    dark: '#003D99',
  },
};

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    error: colors.error,
    warning: colors.warning,
    success: colors.success,
    info: colors.info,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 82, 204, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
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
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '24px 0',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontWeight: 500,
          '&.Mui-active': {
            fontWeight: 600,
          },
          '&.Mui-completed': {
            fontWeight: 500,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
};

export const createAppTheme = (direction: 'ltr' | 'rtl' = 'ltr') => {
  return createTheme({
    ...themeOptions,
    direction,
  });
};

export const theme = createTheme(themeOptions);

export default theme;