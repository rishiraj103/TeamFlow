import type { TaskPriority, TaskStatus } from '../types'

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  completed: 'Completed',
}

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
