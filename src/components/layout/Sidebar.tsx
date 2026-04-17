import type { NavRouteId } from './navConfig'
import { primaryNav } from './navConfig'
import { NavGlyph } from './NavGlyph'

type SidebarProps = {
  activeId: NavRouteId
  onSelect: (id: NavRouteId) => void
  onNewInsight?: () => void
  className?: string
  innerClassName?: string
}

export function Sidebar({
  activeId,
  onSelect,
  onNewInsight,
  className,
  innerClassName,
}: SidebarProps) {
  return (
    <aside
      className={`flex h-full w-[260px] shrink-0 flex-col border-r border-foreground/10 bg-sidebar ${className ?? ''}`}
    >
      <div
        className={`flex min-h-0 flex-1 flex-col px-3 pt-5 ${innerClassName ?? ''}`}
      >
        <div className="mb-6 flex cursor-pointer items-center gap-3 px-2">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-card">
            <NavGlyph id="logoMark" className="size-5 text-card" />
          </span>
          <span className="truncate text-sm md:text-[22px] font-bold text-primary">
            Sample Logo
          </span>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = activeId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`flex w-full items-center gap-3 rounded-r-lg py-2.5 pl-3 pr-3 text-left text-sm md:text-[14px] font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'border-l-4 border-primary bg-primary-light text-primary'
                    : 'border-l-4 border-transparent text-muted hover:bg-foreground/4 hover:text-foreground'
                }`}
              >
                <span className={`size-5 ${active ? 'text-primary' : 'text-muted'}`}>
                  <NavGlyph id={item.glyph} />
                </span>
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-foreground/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => onNewInsight?.()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-card shadow-sm transition-opacity hover:opacity-95 active:opacity-90"
          >
            <span className="text-lg leading-none">+</span>
            New Insight
          </button>
        </div>
      </div>
    </aside>
  )
}
