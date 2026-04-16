import type { NavRouteId } from './navConfig'
import { primaryNav } from './navConfig'
import { NavGlyph } from './NavGlyph'

type BottomNavProps = {
  activeId: NavRouteId
  onSelect: (id: NavRouteId) => void
}

export function BottomNav({ activeId, onSelect }: BottomNavProps) {
  const dockItems = primaryNav.filter((i) => i.showInMobileDock)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-foreground/10 bg-card pb-[env(safe-area-inset-bottom)] laptop:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around gap-1 px-2 pt-2">
        {dockItems.map((item) => {
          const active = activeId === item.id
          return (
            <li key={item.id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`flex w-full cursor-pointer flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                  active ? 'text-primary' : 'text-muted'
                }`}
              >
                <span className={active ? 'text-primary' : 'text-muted'}>
                  <NavGlyph id={item.glyph} className="size-6" />
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
