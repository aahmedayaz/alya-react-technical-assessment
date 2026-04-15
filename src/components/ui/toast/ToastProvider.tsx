import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  ToastContext,
  type ToastContextValue,
  type ToastItem,
} from './toast-context'
import { ToastViewport } from './ToastViewport'

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
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
