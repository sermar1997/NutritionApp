/**
 * Application theme
 */

export const theme = {
  colors: {
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    primaryLight: '#A5D6A7',
    secondary: '#FF9800',
    secondaryDark: '#F57C00',
    secondaryLight: '#FFE0B2',
    tertiary: '#2196F3',
    tertiaryDark: '#1976D2',
    tertiaryLight: '#BBDEFB',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#F44336',
    errorDark: '#D32F2F',
    textPrimary: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#4CAF50',
    successDark: '#388E3C',
    info: '#2196F3',
    warning: '#FF9800',
    white: '#FFFFFF',
    black: '#000000',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    circle: '50%',
  },
  
  typography: {
    fontFamily: {
      body: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      heading: "'Montserrat', sans-serif",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
  
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  
  zIndex: {
    modal: 1000,
    dropdown: 100,
    header: 50,
  },
  
  transitions: {
    short: '0.15s ease-in-out',
    medium: '0.25s ease-in-out',
    long: '0.5s ease-in-out',
  },
};

// Type definition for theme
export type Theme = typeof theme;

// Helper for media queries
export const media = {
  xs: `@media (min-width: ${theme.breakpoints.xs})`,
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
};
