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
  role: 'Demo Account',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Demo%20User&backgroundColor=5b5bd6',
  initials: 'DU',
}

export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password.'
