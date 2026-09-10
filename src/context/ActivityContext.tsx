import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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

function readInitialActivities() {
  const savedActivities = getItem(STORAGE_KEYS.activities, isActivityArray)

  if (savedActivities !== null) {
    return sortActivitiesByNewest(savedActivities).slice(0, MAX_ACTIVITY_HISTORY)
  }

  return [...seedActivities]
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  const { currentUser } = useAuth()
  const [activities, setActivities] = useState(readInitialActivities)
  const initialActivities = useRef(activities)

  useEffect(() => {
    if (activities === initialActivities.current) {
      return
    }

    setItem(STORAGE_KEYS.activities, activities)
  }, [activities])

  const recordActivity = useCallback(
    (details: ActivityDetails) => {
      if (!currentUser) {
        console.warn('[TeamFlow] Skipping activity because no user is authenticated.')
        return
      }

      const newActivity = createActivity(currentUser.id, details, activities)
      setActivities((currentActivities) =>
        [newActivity, ...currentActivities].slice(0, MAX_ACTIVITY_HISTORY),
      )
    },
    [activities, currentUser],
  )

  const value = useMemo<ActivityContextValue>(
    () => ({ activities, recordActivity }),
    [activities, recordActivity],
  )

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}
