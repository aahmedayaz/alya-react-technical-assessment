import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp requires AppProvider')
  }
  return ctx
}
