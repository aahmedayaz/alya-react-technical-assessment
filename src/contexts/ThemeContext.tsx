import {
  createContext,
  useMemo,
  type ReactNode,
} from 'react'
import { appConfig, type AppConfig } from '../config'

type ThemeContextValue = {
  config: AppConfig
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ThemeContextValue>(
    () => ({ config: appConfig }),
    [],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
