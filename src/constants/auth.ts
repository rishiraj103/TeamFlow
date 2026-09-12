import type { AuthUser } from '../types/auth'

export const AUTH_STORAGE_KEY = 'teamflow.auth.user'

export const DEMO_CREDENTIALS = {
  email: 'demo@teamflow.app',
  password: 'password123',
} as const

export const DEMO_USER: AuthUser = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@teamflow.app',
  role: 'Demo account',
  initials: 'DU',
}

export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password.'
