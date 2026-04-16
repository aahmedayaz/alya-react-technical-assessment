import { NavGlyph } from './NavGlyph'

const profile = {
  name: 'Julian Casablancas',
  title: 'Chief Curator',
}

type NavbarProps = {
  onOpenMenu: () => void
}

export function Navbar({ onOpenMenu }: NavbarProps) {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-40 border-b border-foreground/10 bg-card laptop:left-[260px]"
      role="banner"
    >
      <div className="mx-auto flex h-14 max-w-[100vw] items-center gap-3 px-4 laptop:h-16 laptop:gap-6 laptop:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-foreground/6 hover:text-foreground laptop:hidden"
          aria-label="Open navigation menu"
        >
          <NavGlyph id="menu" className="size-6" />
        </button>
        <div className="relative hidden min-w-0 flex-1 laptop:block">
          <label htmlFor="global-search" className="sr-only">
            Search datasets
          </label>
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted">
            <NavGlyph id="search" className="size-[18px]" />
          </span>
          <input
            id="global-search"
            name="q"
            type="search"
            placeholder="Explore datasets..."
            autoComplete="off"
            enterKeyHint="search"
            className="h-11 w-full max-w-xl cursor-pointer rounded-lg border border-foreground/10 bg-page pl-10 pr-4 text-sm text-foreground outline-none ring-primary/30 transition-shadow placeholder:text-muted focus:border-primary/40 focus:ring-2"
          />
        </div>
        <div className="min-w-0 flex-1 laptop:hidden" aria-hidden />
        <button
          type="button"
          className="relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-foreground/6 hover:text-foreground"
          aria-label="Notifications, 1 unread"
        >
          <NavGlyph id="bell" className="size-[36px]" />
        </button>
        <div className="hidden min-w-0 items-center gap-3 laptop:flex">
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-semibold text-foreground">
              {profile.name}
            </p>
            <p className="truncate text-xs text-muted">{profile.title}</p>
          </div>
          <div
            className="relative shrink-0 cursor-pointer"
            aria-label={`Signed in as ${profile.name}`}
          >
            <div className="flex size-11 items-center justify-center overflow-hidden rounded-lg text-primary">
              <NavGlyph id="avatar" className="h-full w-full [&>svg]:overflow-hidden [&>svg]:rounded-lg" />
            </div>
            
          </div>
        </div>
        <div
          className="relative shrink-0 cursor-pointer laptop:hidden"
          aria-label={`Signed in as ${profile.name}`}
        >
          <div className="flex size-11 items-center justify-center overflow-hidden text-primary">
            <NavGlyph id="avatar" className="h-full w-full [&>svg]:overflow-hidden [&>svg]:rounded-md" />
          </div>
        </div>
      </div>
    </header>
  )
}
