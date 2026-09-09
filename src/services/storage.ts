export type StorageValidator<T> = (value: unknown) => value is T

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch (error) {
    console.warn('[TeamFlow] Browser storage is unavailable.', error)
    return null
  }
}

export function getItem<T>(key: string, validator?: StorageValidator<T>): T | null {
  const storage = getStorage()
  let rawValue: string | null | undefined

  try {
    rawValue = storage?.getItem(key)
  } catch (error) {
    console.error(`[TeamFlow] Could not read data for "${key}".`, error)
    return null
  }

  if (rawValue === null || rawValue === undefined) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue)

    if (validator && !validator(parsedValue)) {
      console.warn(`[TeamFlow] Ignoring invalid stored data for "${key}".`)
      return null
    }

    return parsedValue as T
  } catch (error) {
    console.warn(`[TeamFlow] Ignoring malformed stored data for "${key}".`, error)
    return null
  }
}

export function setItem<T>(key: string, value: T): boolean {
  const storage = getStorage()

  if (!storage) {
    return false
  }

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`[TeamFlow] Could not save data for "${key}".`, error)
    return false
  }
}

export function removeItem(key: string): boolean {
  const storage = getStorage()

  if (!storage) {
    return false
  }

  try {
    storage.removeItem(key)
    return true
  } catch (error) {
    console.error(`[TeamFlow] Could not remove data for "${key}".`, error)
    return false
  }
}
