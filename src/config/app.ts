export const colors = {
  primary: '#40408b',
  primaryLight: '#e8e9f4',
  page: '#f3f4f6',
  sidebar: '#f9fafb',
  card: '#ffffff',
  foreground: '#111827',
  muted: '#6b7280',
  successBg: '#dcfce7',
  successFg: '#166534',
  warningBg: '#fef3c7',
  warningFg: '#92400e',
  dangerBg: '#fee2e2',
  dangerFg: '#991b1b',
  chartCurrent: '#40408b',
  chartPrevious: '#d1d5db',
  insight: '#40408b',
} as const

export const breakpoints = {
  mobileSmall: '375px',
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',
  desktopLarge: '1440px',
  desktopXL: '1920px',
  desktop2K: '2560px',
} as const

export const theme = {
  colors,
  breakpoints,
} as const

export const appConfig = {
  colors,
  breakpoints,
} as const

export type AppConfig = typeof appConfig
export type ThemeColors = typeof colors
export type ThemeBreakpoints = typeof breakpoints
