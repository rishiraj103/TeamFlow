import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import type { NotificationPreferences } from '../types'
import { getItem, setItem } from '../services/storage'
import { isNotificationPreferences } from '../services/storageValidation'
import {
  NotificationPreferencesContext,
  type NotificationPreferencesContextValue,
} from './notificationPreferencesContextValue'

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email: true,
  inApp: true,
  taskAssignments: true,
  projectUpdates: true,
}

export interface NotificationPreferencesProviderProps {
  children: ReactNode
}

function readInitialPreferences(): NotificationPreferences {
  return (
    getItem<NotificationPreferences>(STORAGE_KEYS.notifications, isNotificationPreferences) ?? {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
    }
  )
}

export function NotificationPreferencesProvider({
  children,
}: NotificationPreferencesProviderProps) {
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>(readInitialPreferences)
  const initialPreferences = useRef(notificationPreferences)

  useEffect(() => {
    if (notificationPreferences === initialPreferences.current) {
      return
    }

    setItem(STORAGE_KEYS.notifications, notificationPreferences)
  }, [notificationPreferences])

  const updateNotificationPreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setNotificationPreferences((currentPreferences) => ({
      ...currentPreferences,
      ...updates,
    }))
  }, [])

  const value = useMemo<NotificationPreferencesContextValue>(
    () => ({
      notificationPreferences,
      setNotificationPreferences,
      updateNotificationPreferences,
    }),
    [notificationPreferences, updateNotificationPreferences],
  )

  return (
    <NotificationPreferencesContext.Provider value={value}>
      {children}
    </NotificationPreferencesContext.Provider>
  )
}
