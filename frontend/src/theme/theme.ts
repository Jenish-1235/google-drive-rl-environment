import { createTheme, alpha } from '@mui/material/styles';

// Google Drive color palette
export const colors = {
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  primaryLight: '#4285f4',

  surface: '#ffffff',
  surfaceVariant: '#f1f3f4',

  background: '#ffffff',
  backgroundGray: '#f8f9fa',

  error: '#d93025',
  warning: '#f9ab00',
  success: '#1e8e3e',
  info: '#1a73e8',

  text: {
    primary: '#202124',
    secondary: '#5f6368',
    disabled: '#80868b',
  },

  border: '#e8eaed',
  divider: '#e8eaed',

  hover: 'rgba(26, 115, 232, 0.08)',
  selected: 'rgba(26, 115, 232, 0.12)',

  // File type colors
  fileTypes: {
    folder: '#5f6368',
    document: '#4285f4',
    spreadsheet: '#0f9d58',
    presentation: '#f4b400',
    pdf: '#d93025',
    image: '#f4b400',
    video: '#d93025',
    audio: '#f4b400',
    archive: '#5f6368',
    other: '#5f6368',
  }
};

// Create Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.text.secondary,
      contrastText: '#ffffff',
    },
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    success: {
      main: colors.success,
    },
    info: {
      main: colors.info,
    },
    background: {
      default: colors.backgroundGray,
      paper: colors.surface,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.divider,
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '28px',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '22px',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '14px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '13px',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '12px',
      lineHeight: 1.4,
      color: colors.text.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Base spacing unit
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 24px',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          },
        },
        outlined: {
          borderColor: colors.border,
          '&:hover': {
            borderColor: colors.border,
            backgroundColor: alpha(colors.primary, 0.04),
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.04),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: 12,
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.08),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        },
        elevation2: {
          boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
        },
        elevation3: {
          boxShadow: '0 4px 8px 3px rgba(60,64,67,0.15), 0 1px 3px 0 rgba(60,64,67,0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${colors.border}`,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.border,
            },
            '&:hover fieldset': {
              borderColor: colors.text.secondary,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.text.secondary,
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.08),
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary, 0.12),
            '&:hover': {
              backgroundColor: alpha(colors.primary, 0.16),
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.04),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary, 0.08),
            '&:hover': {
              backgroundColor: alpha(colors.primary, 0.12),
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          marginTop: 4,
          minWidth: 180,
          boxShadow: '0 2px 6px 2px rgba(60,64,67,0.15), 0 1px 3px 0 rgba(60,64,67,0.3)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 14,
          padding: '8px 12px',
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.08),
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 8px 16px 4px rgba(60,64,67,0.15), 0 4px 8px 0 rgba(60,64,67,0.3)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.text.primary,
          fontSize: 12,
          padding: '6px 12px',
          borderRadius: 4,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8f9fa',
        },
        '#root': {
          backgroundColor: '#f8f9fa',
        },
      },
    },
  },
});

export default theme;
