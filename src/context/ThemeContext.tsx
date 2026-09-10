import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import { getItem, setItem } from '../services/storage'
import { isThemeMode } from '../services/storageValidation'
import type { ThemeMode } from '../types'
import { ThemeContext, type ThemeContextValue } from './themeContextValue'

export interface ThemeProviderProps {
  children: ReactNode
}

interface InitialThemeState {
  theme: ThemeMode
  error: string | null
}

function readInitialThemeState(): InitialThemeState {
  let loadIssue: string | null = null
  const theme =
    getItem<ThemeMode>(STORAGE_KEYS.theme, isThemeMode, (issue) => {
      loadIssue ??= issue.message
    }) ?? 'light'

  return { theme, error: loadIssue }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [initialState] = useState<InitialThemeState>(readInitialThemeState)
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(initialState.theme)
  const [error, setError] = useState<string | null>(initialState.error)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = currentTheme
  }, [currentTheme])

  const persistTheme = useCallback((theme: ThemeMode) => {
    if (!setItem(STORAGE_KEYS.theme, theme)) {
      setError(
        `We couldn't save data for ${STORAGE_KEYS.theme}. Your latest preference is currently in memory only.`,
      )
      return
    }

    setError(null)
  }, [])

  const retryPersistence = useCallback(() => {
    persistTheme(currentTheme)
  }, [currentTheme, persistTheme])

  const setTheme = useCallback(
    (theme: ThemeMode) => {
      setCurrentTheme(theme)
      persistTheme(theme)
    },
    [persistTheme],
  )

  const toggleTheme = useCallback(() => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(nextTheme)
    persistTheme(nextTheme)
  }, [currentTheme, persistTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({ currentTheme, error, retryPersistence, setTheme, toggleTheme }),
    [currentTheme, error, retryPersistence, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
