import type { Activity, ActivityType } from '../types'

export const MAX_ACTIVITY_HISTORY = 100

export interface ActivityDetails {
  type: ActivityType
  description: string
  projectId?: string
  taskId?: string
}

function createActivityId(existingActivities: Activity[]): string {
  const existingIds = new Set(existingActivities.map((activity) => activity.id))
  const randomId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  let candidate = `activity-${randomId}`
  let suffix = 1

  while (existingIds.has(candidate)) {
    candidate = `activity-${randomId}-${suffix}`
    suffix += 1
  }

  return candidate
}

export function createActivity(
  userId: string,
  details: ActivityDetails,
  existingActivities: Activity[] = [],
): Activity {
  return {
    id: createActivityId(existingActivities),
    userId,
    ...details,
    timestamp: new Date().toISOString(),
  }
}

export function sortActivitiesByNewest(activities: Activity[]): Activity[] {
  return [...activities].sort((leftActivity, rightActivity) => {
    const leftTimestamp = new Date(leftActivity.timestamp).getTime()
    const rightTimestamp = new Date(rightActivity.timestamp).getTime()
    const safeLeftTimestamp = Number.isNaN(leftTimestamp) ? 0 : leftTimestamp
    const safeRightTimestamp = Number.isNaN(rightTimestamp) ? 0 : rightTimestamp

    return safeRightTimestamp - safeLeftTimestamp
  })
}
