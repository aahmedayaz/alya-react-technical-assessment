import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ToastStack } from '../components/library/ToastStack'
import type { ToastItem } from '../types/toast'

export type { ToastItem, ToastType } from '../types/toast'

export type ToastContextValue = {
  push: (toast: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback<ToastContextValue['push']>((toast) => {
    setItems((prev) => [...prev, { ...toast, id: createId() }])
  }, [])

  const dismiss = useCallback<ToastContextValue['dismiss']>((id) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ push, dismiss }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
