import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DEMO_CREDENTIALS, DEMO_USER, INVALID_CREDENTIALS_MESSAGE } from '../constants/auth'
import {
  clearStoredAuthUser,
  readStoredAuthUser,
  saveStoredAuthUser,
} from '../services/authStorage'
import { AuthContext, type AuthContextValue, type LoginResult } from './contextValue'
import type { AuthUser } from '../types/auth'

export type { AuthState, AuthUser } from '../types/auth'
export type { AuthContextValue, LoginResult } from './contextValue'

export interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => readStoredAuthUser())

  const login = useCallback((email: string, password: string): LoginResult => {
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedEmail !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      return { success: false, error: INVALID_CREDENTIALS_MESSAGE }
    }

    try {
      saveStoredAuthUser(DEMO_USER)
      setCurrentUser(DEMO_USER)
      return { success: true }
    } catch {
      return {
        success: false,
        error: 'Unable to save authentication state. Please check browser storage and try again.',
      }
    }
  }, [])

  const logout = useCallback(() => {
    clearStoredAuthUser()
    setCurrentUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: currentUser !== null,
      isInitializing: false,
      login,
      logout,
    }),
    [currentUser, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
