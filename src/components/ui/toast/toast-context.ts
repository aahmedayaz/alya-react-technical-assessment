import { createContext } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastItem = {
  id: string
  type: ToastType
  message: string
}

export type ToastContextValue = {
  push: (toast: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
