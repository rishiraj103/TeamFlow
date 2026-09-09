import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import { getItem, setItem } from '../services/storage'
import { isThemeMode } from '../services/storageValidation'
import type { ThemeMode } from '../types'
import { ThemeContext, type ThemeContextValue } from './themeContextValue'

export interface ThemeProviderProps {
  children: ReactNode
}

function readInitialTheme(): ThemeMode {
  return getItem<ThemeMode>(STORAGE_KEYS.theme, isThemeMode) ?? 'light'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(readInitialTheme)
  const initialTheme = useRef(currentTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme

    if (currentTheme !== initialTheme.current) {
      setItem(STORAGE_KEYS.theme, currentTheme)
    }
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
