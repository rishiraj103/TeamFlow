import { useContext } from 'react'
import { NotificationPreferencesContext } from './notificationPreferencesContextValue'

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferencesContext)

  if (!context) {
    throw new Error(
      'useNotificationPreferences must be used within a NotificationPreferencesProvider',
    )
  }

  return context
}
