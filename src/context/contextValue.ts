import { createContext } from 'react'
import type { AuthState, AuthUser } from '../types/auth'

export type LoginResult = { success: true } | { success: false; error: string }

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => LoginResult
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export type { AuthUser }
