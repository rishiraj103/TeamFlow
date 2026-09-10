import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import { activities as seedActivities } from '../data/activities'
import {
  createActivity,
  MAX_ACTIVITY_HISTORY,
  sortActivitiesByNewest,
  type ActivityDetails,
} from '../services/activity'
import { getItem, setItem } from '../services/storage'
import { isActivityArray } from '../services/storageValidation'
import { useAuth } from './useAuth'
import { ActivityContext, type ActivityContextValue } from './activityContextValue'

export interface ActivityProviderProps {
  children: ReactNode
}

interface InitialActivitiesState {
  activities: typeof seedActivities
  error: string | null
}

function readInitialActivitiesState(): InitialActivitiesState {
  let loadIssue: string | null = null
  const savedActivities = getItem(STORAGE_KEYS.activities, isActivityArray, (issue) => {
    loadIssue ??= issue.message
  })

  if (savedActivities !== null) {
    return {
      activities: sortActivitiesByNewest(savedActivities).slice(0, MAX_ACTIVITY_HISTORY),
      error: loadIssue,
    }
  }

  return { activities: [...seedActivities], error: loadIssue }
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  const { currentUser } = useAuth()
  const [initialState] = useState<InitialActivitiesState>(readInitialActivitiesState)
  const [activities, setActivities] = useState<typeof seedActivities>(initialState.activities)
  const [error, setError] = useState<string | null>(initialState.error)
  const isLoading = false

  const persistActivities = useCallback((nextActivities: typeof seedActivities) => {
    if (!setItem(STORAGE_KEYS.activities, nextActivities)) {
      setError(
        `We couldn't save data for ${STORAGE_KEYS.activities}. Your latest changes are currently in memory only.`,
      )
      return
    }

    setError(null)
  }, [])

  const retryPersistence = useCallback(() => {
    persistActivities(activities)
  }, [activities, persistActivities])

  const recordActivity = useCallback(
    (details: ActivityDetails) => {
      if (!currentUser) {
        console.warn('[TeamFlow] Skipping activity because no user is authenticated.')
        return
      }

      const newActivity = createActivity(currentUser.id, details, activities)
      const nextActivities = [newActivity, ...activities].slice(0, MAX_ACTIVITY_HISTORY)
      setActivities(nextActivities)
      persistActivities(nextActivities)
    },
    [activities, currentUser, persistActivities],
  )

  const value = useMemo<ActivityContextValue>(
    () => ({ activities, isLoading, error, retryPersistence, recordActivity }),
    [activities, error, isLoading, recordActivity, retryPersistence],
  )

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}
