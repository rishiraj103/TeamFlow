import { AUTH_STORAGE_KEY } from '../constants/auth'
import type { AuthUser } from '../types/auth'

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

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
    typeof candidate.initials === 'string'
  )
}

export function readStoredAuthUser(): AuthUser | null {
  try {
    const storage = getStorage()
    const rawValue = storage?.getItem(AUTH_STORAGE_KEY)

    if (!rawValue) {
      return null
    }

    const parsedValue: unknown = JSON.parse(rawValue)
    return isAuthUser(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

export function saveStoredAuthUser(user: AuthUser): void {
  const storage = getStorage()

  if (!storage) {
    throw new Error('Local storage is unavailable.')
  }

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredAuthUser(): void {
  getStorage()?.removeItem(AUTH_STORAGE_KEY)
}
