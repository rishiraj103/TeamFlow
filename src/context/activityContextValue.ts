import { createContext } from 'react'
import type { Activity } from '../types'
import type { ActivityDetails } from '../services/activity'

export interface ActivityContextValue {
  activities: Activity[]
  recordActivity: (details: ActivityDetails) => void
}

export const ActivityContext = createContext<ActivityContextValue | undefined>(undefined)
