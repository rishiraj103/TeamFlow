import type { Project, Task } from '../types'

export function calculateProjectProgress(tasks: readonly Task[], projectId: string): number {
  const projectTasks = tasks.filter((task) => task.projectId === projectId)

  if (projectTasks.length === 0) {
    return 0
  }

  const completedTasks = projectTasks.filter((task) => task.status === 'completed').length
  return Math.round((completedTasks / projectTasks.length) * 100)
}

export function calculateProgressByProject(
  projects: readonly Project[],
  tasks: readonly Task[],
): Record<string, number> {
  return Object.fromEntries(
    projects.map((project) => [project.id, calculateProjectProgress(tasks, project.id)]),
  )
}
