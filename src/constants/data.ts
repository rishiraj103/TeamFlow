export const USER_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'Product Manager',
  'QA Engineer',
  'DevOps Engineer',
  'Demo Account',
] as const

export const PROJECT_STATUSES = ['active', 'completed', 'archived'] as const

export const TASK_STATUSES = ['todo', 'in-progress', 'completed'] as const

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const

export const ACTIVITY_TYPES = [
  'project-created',
  'project-updated',
  'project-deleted',
  'task-created',
  'task-updated',
  'task-deleted',
  'task-status-changed',
  'task-assigned',
  'task-completed',
] as const
