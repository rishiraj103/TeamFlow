import { createContext } from 'react'
import type { ThemeMode } from '../types'

export interface ThemeContextValue {
  currentTheme: ThemeMode
  error: string | null
  retryPersistence: () => void
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
