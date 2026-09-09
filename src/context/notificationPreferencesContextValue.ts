import { createContext } from 'react'
import type { NotificationPreferences } from '../types'

export interface NotificationPreferencesContextValue {
  notificationPreferences: NotificationPreferences
  setNotificationPreferences: (preferences: NotificationPreferences) => void
  updateNotificationPreferences: (updates: Partial<NotificationPreferences>) => void
}

export const NotificationPreferencesContext = createContext<
  NotificationPreferencesContextValue | undefined
>(undefined)
