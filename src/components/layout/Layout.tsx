import { useEffect, useState, type ReactNode } from 'react'
import type { NavRouteId } from './navConfig'
import { BottomNav } from './BottomNav'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

type LayoutProps = {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [activeId, setActiveId] = useState<NavRouteId>('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

  return (
    <div className="min-h-dvh bg-page text-foreground">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-60 rounded bg-primary px-3 py-2 text-sm font-medium text-card focus:not-sr-only focus:absolute focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Skip to content
      </a>
      <div className="hidden laptop:fixed laptop:inset-y-0 laptop:left-0 laptop:z-30 laptop:flex">
        <Sidebar activeId={activeId} onSelect={setActiveId} />
      </div>
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 laptop:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 cursor-pointer bg-foreground/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(280px,88vw)] bg-sidebar shadow-2xl">
            <Sidebar
              activeId={activeId}
              onSelect={(id) => {
                setActiveId(id)
                setDrawerOpen(false)
              }}
            />
          </div>
        </div>
      ) : null}
      <Navbar onOpenMenu={() => setDrawerOpen(true)} />
      <div className="flex min-h-dvh flex-col pt-14 laptop:pl-[260px] laptop:pt-16">
        <main
          id="main-content"
          className="flex-1 px-4 pb-24 pt-2 laptop:px-8 laptop:pb-8 laptop:pt-4"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
        <BottomNav activeId={activeId} onSelect={setActiveId} />
      </div>
    </div>
  )
}
