import {
  createContext,
  useMemo,
  type ReactNode,
} from 'react'
import { appConfig, type AppConfig } from '../config'

type AppContextValue = {
  config: AppConfig
}

export const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AppContextValue>(
    () => ({ config: appConfig }),
    [],
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
