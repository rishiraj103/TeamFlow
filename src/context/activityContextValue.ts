import { createContext } from 'react'
import type { Activity } from '../types'
import type { ActivityDetails } from '../services/activity'

export interface ActivityContextValue {
  activities: Activity[]
  isLoading: boolean
  error: string | null
  retryPersistence: () => void
  recordActivity: (details: ActivityDetails) => void
}

export const ActivityContext = createContext<ActivityContextValue | undefined>(undefined)
