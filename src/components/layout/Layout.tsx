import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { NavRouteId } from './navConfig'
import { BottomNav } from './BottomNav'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useToast } from '../../hooks'

const paths: Record<NavRouteId, string> = {
  dashboard: '/',
  analytics: '/products',
  reports: '/onboarding',
  users: '/library',
  settings: '/settings',
}

function pathToActive(pathname: string): NavRouteId {
  if (pathname.startsWith('/products')) return 'analytics'
  if (pathname.startsWith('/onboarding')) return 'reports'
  if (pathname.startsWith('/library')) return 'users'
  if (pathname.startsWith('/settings')) return 'settings'
  return 'dashboard'
}

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { push } = useToast()

  const activeId = useMemo(
    () => pathToActive(location.pathname),
    [location.pathname],
  )

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

  const onSelect = (id: NavRouteId) => {
    navigate(paths[id])
  }

  const onNewInsight = () => {
    push({
      type: 'info',
      title: 'New insight',
      message: 'Opening onboarding.',
    })
    navigate('/onboarding')
  }

  return (
    <div className="min-h-dvh bg-page text-foreground">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-60 rounded bg-primary px-3 py-2 text-sm font-medium text-card focus:not-sr-only focus:absolute focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Skip to content
      </a>
      <div className="hidden laptop:fixed laptop:inset-y-0 laptop:left-0 laptop:z-30 laptop:flex">
        <Sidebar
          activeId={activeId}
          onSelect={onSelect}
          onNewInsight={onNewInsight}
        />
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
                onSelect(id)
                setDrawerOpen(false)
              }}
              onNewInsight={() => {
                onNewInsight()
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
          className="flex-1 px-4 pb-24 pt-2 laptop:px-8 laptop:pb-8 laptop:pt-4 bg-sidebar"
          role="main"
          tabIndex={-1}
        >
          <Outlet />
        </main>
        <BottomNav activeId={activeId} onSelect={onSelect} />
      </div>
    </div>
  )
}
