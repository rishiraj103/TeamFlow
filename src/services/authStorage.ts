import { AUTH_STORAGE_KEY } from '../constants/auth'
import { getItem, removeItem, setItem } from './storage'
import type { AuthUser } from '../types/auth'

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.role === 'string' &&
    typeof candidate.avatar === 'string' &&
    typeof candidate.initials === 'string'
  )
}

export function readStoredAuthUser(): AuthUser | null {
  return getItem<AuthUser>(AUTH_STORAGE_KEY, isAuthUser)
}

export function saveStoredAuthUser(user: AuthUser): void {
  if (!setItem(AUTH_STORAGE_KEY, user)) {
    throw new Error('Local storage is unavailable.')
  }
}

export function clearStoredAuthUser(): void {
  removeItem(AUTH_STORAGE_KEY)
}
