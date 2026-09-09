import { PROJECT_STATUSES, TASK_PRIORITIES, TASK_STATUSES } from '../constants/data'
import type { NotificationPreferences, Project, Task, ThemeMode } from '../types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function hasUniqueIds<T extends { id: string }>(items: T[]): boolean {
  return new Set(items.map((item) => item.id)).size === items.length
}

function isProject(value: unknown): value is Project {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.description === 'string' &&
    PROJECT_STATUSES.includes(value.status as Project['status']) &&
    typeof value.progress === 'number' &&
    Number.isFinite(value.progress) &&
    value.progress >= 0 &&
    value.progress <= 100 &&
    typeof value.dueDate === 'string' &&
    isStringArray(value.memberIds)
  )
}

export function isProjectArray(value: unknown): value is Project[] {
  return Array.isArray(value) && value.every(isProject) && hasUniqueIds(value)
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.projectId === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    TASK_STATUSES.includes(value.status as Task['status']) &&
    TASK_PRIORITIES.includes(value.priority as Task['priority']) &&
    typeof value.assigneeId === 'string' &&
    typeof value.dueDate === 'string'
  )
}

export function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask) && hasUniqueIds(value)
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}

export function isNotificationPreferences(value: unknown): value is NotificationPreferences {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.taskDeadlines === 'boolean' &&
    typeof value.projectUpdates === 'boolean' &&
    typeof value.activityUpdates === 'boolean'
  )
}
