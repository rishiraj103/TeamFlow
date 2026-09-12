import type { TaskPriority, TaskStatus } from '../types'

export interface TaskFormValues {
  title: string
  description: string
  projectId: string
  status: TaskStatus | ''
  priority: TaskPriority | ''
  assigneeId: string
  dueDate: string
}

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>

export function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {}

  if (!values.title.trim()) {
    errors.title = 'Task title is required.'
  }

  if (!values.description.trim()) {
    errors.description = 'Task description is required.'
  }

  if (!values.projectId) {
    errors.projectId = 'Select a project for this task.'
  }

  if (!values.status) {
    errors.status = 'Select a task status.'
  }

  if (!values.priority) {
    errors.priority = 'Select a task priority.'
  }

  if (!values.assigneeId) {
    errors.assigneeId = 'Select an assignee for this task.'
  }

  if (!values.dueDate) {
    errors.dueDate = 'Choose a due date.'
  }

  return errors
}
