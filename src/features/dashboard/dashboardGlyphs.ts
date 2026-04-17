import iconCalendar from '../../assets/icons/dashboard/icon-calendar.svg?raw'
import iconDownload from '../../assets/icons/dashboard/icon-download.svg?raw'
import iconDollar from '../../assets/icons/dashboard/icon-dollar.svg?raw'
import iconUsersMetric from '../../assets/icons/dashboard/icon-users-metric.svg?raw'
import iconPercent from '../../assets/icons/dashboard/icon-percent.svg?raw'
import iconTrendUp from '../../assets/icons/dashboard/icon-trend-up.svg?raw'
import iconTrendDown from '../../assets/icons/dashboard/icon-trend-down.svg?raw'

export const dashboardGlyphHtml = {
  calendar: iconCalendar,
  download: iconDownload,
  dollar: iconDollar,
  usersMetric: iconUsersMetric,
  percent: iconPercent,
  trendUp: iconTrendUp,
  trendDown: iconTrendDown,
} as const

export type DashboardGlyphId = keyof typeof dashboardGlyphHtml
