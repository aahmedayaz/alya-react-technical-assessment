import type { NavGlyphId } from './navGlyphs'

export type NavRouteId =
  | 'dashboard'
  | 'analytics'
  | 'reports'
  | 'users'
  | 'settings'

export const primaryNav: {
  id: NavRouteId
  label: string
  glyph: NavGlyphId
  showInMobileDock: boolean
}[] = [
  { id: 'dashboard', label: 'Dashboard', glyph: 'dashboard', showInMobileDock: true },
  { id: 'analytics', label: 'Analytics', glyph: 'analytics', showInMobileDock: true },
  { id: 'reports', label: 'Reports', glyph: 'reports', showInMobileDock: false },
  { id: 'users', label: 'Users', glyph: 'users', showInMobileDock: true },
  { id: 'settings', label: 'Settings', glyph: 'settings', showInMobileDock: true },
]
