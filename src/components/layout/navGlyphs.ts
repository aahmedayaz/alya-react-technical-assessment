import logoMark from '../../assets/icons/logo-mark.svg?raw'
import navDashboard from '../../assets/icons/nav-dashboard.svg?raw'
import navAnalytics from '../../assets/icons/nav-analytics.svg?raw'
import navReports from '../../assets/icons/nav-reports.svg?raw'
import navUsers from '../../assets/icons/nav-users.svg?raw'
import navSettings from '../../assets/icons/nav-settings.svg?raw'
import iconMenu from '../../assets/icons/icon-menu.svg?raw'
import iconBell from '../../assets/icons/icon-bell.svg?raw'
import iconSearch from '../../assets/icons/icon-search.svg?raw'
import avatar from '../../assets/icons/avatar.svg?raw'

export const navGlyphHtml = {
  logoMark,
  dashboard: navDashboard,
  analytics: navAnalytics,
  reports: navReports,
  users: navUsers,
  settings: navSettings,
  menu: iconMenu,
  bell: iconBell,
  search: iconSearch,
  avatar,
} as const

export type NavGlyphId = keyof typeof navGlyphHtml
