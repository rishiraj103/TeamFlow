import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ThemeMode } from '../types'
import { ThemeContext, type ThemeContextValue } from './themeContextValue'

export interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme
  }, [currentTheme])

  const setTheme = useCallback((theme: ThemeMode) => {
    setCurrentTheme(theme)
  }, [])

  const toggleTheme = useCallback(() => {
    setCurrentTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ currentTheme, setTheme, toggleTheme }),
    [currentTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
