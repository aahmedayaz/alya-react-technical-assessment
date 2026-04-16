import { navGlyphHtml, type NavGlyphId } from './navGlyphs'

type NavGlyphProps = {
  id: NavGlyphId
  className?: string
}

export function NavGlyph({ id, className }: NavGlyphProps) {
  return (
    <span
      className={`inline-flex size-[22px] shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full ${className ?? ''}`}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: navGlyphHtml[id] }}
    />
  )
}
