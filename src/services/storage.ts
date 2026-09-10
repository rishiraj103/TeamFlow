export type StorageValidator<T> = (value: unknown) => value is T

export type StorageOperation = 'read' | 'write' | 'remove'

export interface StorageIssue {
  key: string
  operation: StorageOperation
  message: string
}

export type StorageIssueHandler = (issue: StorageIssue) => void

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch (error) {
    console.warn('[TeamFlow] Browser storage is unavailable.', error)
    return null
  }
}

export function getItem<T>(
  key: string,
  validator?: StorageValidator<T>,
  onIssue?: StorageIssueHandler,
): T | null {
  const storage = getStorage()
  let rawValue: string | null | undefined

  if (!storage && typeof window !== 'undefined') {
    onIssue?.({
      key,
      operation: 'read',
      message: `We couldn't read saved data for ${key}. Fallback data is being used.`,
    })
    return null
  }

  try {
    rawValue = storage?.getItem(key)
  } catch (error) {
    console.error(`[TeamFlow] Could not read data for "${key}".`, error)
    onIssue?.({
      key,
      operation: 'read',
      message: `We couldn't read saved data for ${key}. Fallback data is being used.`,
    })
    return null
  }

  if (rawValue === null || rawValue === undefined) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue)

    if (validator && !validator(parsedValue)) {
      console.warn(`[TeamFlow] Ignoring invalid stored data for "${key}".`)
      onIssue?.({
        key,
        operation: 'read',
        message: `Saved data for ${key} is invalid. Fallback data is being used.`,
      })
      return null
    }

    return parsedValue as T
  } catch (error) {
    console.warn(`[TeamFlow] Ignoring malformed stored data for "${key}".`, error)
    onIssue?.({
      key,
      operation: 'read',
      message: `Saved data for ${key} is malformed. Fallback data is being used.`,
    })
    return null
  }
}

export function setItem<T>(key: string, value: T, onIssue?: StorageIssueHandler): boolean {
  const storage = getStorage()

  if (!storage) {
    if (typeof window !== 'undefined') {
      onIssue?.({
        key,
        operation: 'write',
        message: `We couldn't save data for ${key}. Your latest changes are currently in memory only.`,
      })
    }
    return false
  }

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`[TeamFlow] Could not save data for "${key}".`, error)
    onIssue?.({
      key,
      operation: 'write',
      message: `We couldn't save data for ${key}. Your latest changes are currently in memory only.`,
    })
    return false
  }
}

export function removeItem(key: string, onIssue?: StorageIssueHandler): boolean {
  const storage = getStorage()

  if (!storage) {
    if (typeof window !== 'undefined') {
      onIssue?.({
        key,
        operation: 'remove',
        message: `We couldn't clear saved data for ${key}.`,
      })
    }
    return false
  }

  try {
    storage.removeItem(key)
    return true
  } catch (error) {
    console.error(`[TeamFlow] Could not remove data for "${key}".`, error)
    onIssue?.({
      key,
      operation: 'remove',
      message: `We couldn't clear saved data for ${key}.`,
    })
    return false
  }
}
