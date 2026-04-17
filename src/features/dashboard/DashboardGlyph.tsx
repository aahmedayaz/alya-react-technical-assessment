import { dashboardGlyphHtml, type DashboardGlyphId } from './dashboardGlyphs'

type DashboardGlyphProps = {
  id: DashboardGlyphId
  className?: string
}

export function DashboardGlyph({ id, className }: DashboardGlyphProps) {
  return (
    <span
      className={`inline-flex items-center justify-center [&>svg]:h-full [&>svg]:w-full ${className ?? ''}`}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: dashboardGlyphHtml[id] }}
    />
  )
}
