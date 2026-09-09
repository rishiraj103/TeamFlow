import { PROJECT_STATUSES, TASK_PRIORITIES, TASK_STATUSES } from '../constants/data'
import type { Project, ProjectStatus, Task, TaskPriority, TaskStatus } from '../types'
import { taskPriorityLabels, taskStatusLabels } from './taskLabels'

export interface AnalyticsMetric {
  key: string
  label: string
  count: number
}

export interface AnalyticsSummary {
  tasksByStatus: AnalyticsMetric[]
  tasksByPriority: AnalyticsMetric[]
  projectsByStatus: AnalyticsMetric[]
  totalTasks: number
  completedTasks: number
  completionRate: number
}

const projectStatusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
}

function countTasksByStatus(tasks: Task[], status: TaskStatus): number {
  return tasks.filter((task) => task.status === status).length
}

function countTasksByPriority(tasks: Task[], priority: TaskPriority): number {
  return tasks.filter((task) => task.priority === priority).length
}

function countProjectsByStatus(projects: Project[], status: ProjectStatus): number {
  return projects.filter((project) => project.status === status).length
}

export function calculateAnalytics(projects: Project[], tasks: Task[]): AnalyticsSummary {
  const totalTasks = tasks.length
  const completedTasks = countTasksByStatus(tasks, 'completed')

  return {
    tasksByStatus: TASK_STATUSES.map((status) => ({
      key: status,
      label: taskStatusLabels[status],
      count: countTasksByStatus(tasks, status),
    })),
    tasksByPriority: TASK_PRIORITIES.map((priority) => ({
      key: priority,
      label: taskPriorityLabels[priority],
      count: countTasksByPriority(tasks, priority),
    })),
    projectsByStatus: PROJECT_STATUSES.map((status) => ({
      key: status,
      label: projectStatusLabels[status],
      count: countProjectsByStatus(projects, status),
    })),
    totalTasks,
    completedTasks,
    completionRate: totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100,
  }
}

export function formatAnalyticsPercentage(value: number): string {
  if (!Number.isFinite(value)) {
    return '0%'
  }

  const safeValue = Math.min(Math.max(value, 0), 100)
  return Number.isInteger(safeValue) ? `${safeValue}%` : `${safeValue.toFixed(1)}%`
}
