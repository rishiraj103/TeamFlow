import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import type { NotificationPreferences } from '../types'
import { getItem, setItem } from '../services/storage'
import { isNotificationPreferences } from '../services/storageValidation'
import {
  NotificationPreferencesContext,
  type NotificationPreferencesContextValue,
} from './notificationPreferencesContextValue'

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  taskDeadlines: true,
  projectUpdates: true,
  activityUpdates: true,
}

export interface NotificationPreferencesProviderProps {
  children: ReactNode
}

interface InitialPreferencesState {
  preferences: NotificationPreferences
  error: string | null
}

function readInitialPreferencesState(): InitialPreferencesState {
  let loadIssue: string | null = null
  const preferences = getItem<NotificationPreferences>(
    STORAGE_KEYS.notifications,
    isNotificationPreferences,
    (issue) => {
      loadIssue ??= issue.message
    },
  ) ?? { ...DEFAULT_NOTIFICATION_PREFERENCES }

  return { preferences, error: loadIssue }
}

export function NotificationPreferencesProvider({
  children,
}: NotificationPreferencesProviderProps) {
  const [initialState] = useState<InitialPreferencesState>(readInitialPreferencesState)
  const [notificationPreferences, setNotificationPreferencesState] =
    useState<NotificationPreferences>(initialState.preferences)
  const [error, setError] = useState<string | null>(initialState.error)

  const persistPreferences = useCallback((preferences: NotificationPreferences) => {
    if (!setItem(STORAGE_KEYS.notifications, preferences)) {
      setError(
        `We couldn't save data for ${STORAGE_KEYS.notifications}. Your latest preferences are currently in memory only.`,
      )
      return
    }

    setError(null)
  }, [])

  const setNotificationPreferences = useCallback(
    (preferences: NotificationPreferences) => {
      setNotificationPreferencesState(preferences)
      persistPreferences(preferences)
    },
    [persistPreferences],
  )

  const updateNotificationPreferences = useCallback(
    (updates: Partial<NotificationPreferences>) => {
      const nextPreferences = { ...notificationPreferences, ...updates }
      setNotificationPreferences(nextPreferences)
    },
    [notificationPreferences, setNotificationPreferences],
  )

  const retryPersistence = useCallback(() => {
    persistPreferences(notificationPreferences)
  }, [notificationPreferences, persistPreferences])

  const value = useMemo<NotificationPreferencesContextValue>(
    () => ({
      notificationPreferences,
      error,
      retryPersistence,
      setNotificationPreferences,
      updateNotificationPreferences,
    }),
    [
      error,
      notificationPreferences,
      retryPersistence,
      setNotificationPreferences,
      updateNotificationPreferences,
    ],
  )

  return (
    <NotificationPreferencesContext.Provider value={value}>
      {children}
    </NotificationPreferencesContext.Provider>
  )
}
