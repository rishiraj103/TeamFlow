import type { SortDirection, Task, TaskFilterState, TaskPriority, TaskSortField } from '../types'

export type TaskSortOption =
  'dueDate:asc' | 'dueDate:desc' | 'priority:desc' | 'priority:asc' | 'title:asc' | 'title:desc'

export const DEFAULT_TASK_FILTERS: TaskFilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
  assigneeId: 'all',
  sortBy: 'dueDate',
  sortDirection: 'asc',
}

export const taskSortOptions: Array<{ label: string; value: TaskSortOption }> = [
  { label: 'Due date: earliest first', value: 'dueDate:asc' },
  { label: 'Due date: latest first', value: 'dueDate:desc' },
  { label: 'Priority: high to low', value: 'priority:desc' },
  { label: 'Priority: low to high', value: 'priority:asc' },
  { label: 'Title: A-Z', value: 'title:asc' },
  { label: 'Title: Z-A', value: 'title:desc' },
]

const priorityRank: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

export function getTaskSortOption(filters: Pick<TaskFilterState, 'sortBy' | 'sortDirection'>) {
  return `${filters.sortBy}:${filters.sortDirection}` as TaskSortOption
}

function compareTasks(leftTask: Task, rightTask: Task, sortBy: TaskSortField): number {
  if (sortBy === 'dueDate') {
    return leftTask.dueDate.localeCompare(rightTask.dueDate)
  }

  if (sortBy === 'priority') {
    return priorityRank[leftTask.priority] - priorityRank[rightTask.priority]
  }

  return leftTask.title.localeCompare(rightTask.title, undefined, { sensitivity: 'base' })
}

function sortTasks(tasks: Task[], sortBy: TaskSortField, sortDirection: SortDirection): Task[] {
  return [...tasks].sort((leftTask, rightTask) => {
    const comparison = compareTasks(leftTask, rightTask, sortBy)

    if (comparison !== 0) {
      return sortDirection === 'asc' ? comparison : -comparison
    }

    return leftTask.id.localeCompare(rightTask.id)
  })
}

export function filterTasks(tasks: Task[], filters: TaskFilterState): Task[] {
  const normalizedSearch = filters.search.trim().toLowerCase()
  let visibleTasks = [...tasks]

  if (normalizedSearch) {
    visibleTasks = visibleTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description.toLowerCase().includes(normalizedSearch),
    )
  }

  if (filters.status !== 'all') {
    visibleTasks = visibleTasks.filter((task) => task.status === filters.status)
  }

  if (filters.priority !== 'all') {
    visibleTasks = visibleTasks.filter((task) => task.priority === filters.priority)
  }

  if (filters.projectId !== 'all') {
    visibleTasks = visibleTasks.filter((task) => task.projectId === filters.projectId)
  }

  if (filters.assigneeId !== 'all') {
    visibleTasks = visibleTasks.filter((task) => task.assigneeId === filters.assigneeId)
  }

  return sortTasks(visibleTasks, filters.sortBy, filters.sortDirection)
}
