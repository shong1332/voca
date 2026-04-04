const theme = {
  colors: {
    primary: '#4F46E5',
    primaryLight: '#818CF8',
    primaryDark: '#3730A3',
    success: '#10B981',
    successLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceHover: '#F1F5F9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
  },
  fonts: {
    body: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
  },
  mq: {
    mobile: '@media (max-width: 480px)',
    tablet: '@media (max-width: 768px)',
  },
} as const;

export type Theme = typeof theme;
export default theme;
