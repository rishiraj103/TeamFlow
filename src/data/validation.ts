import { ACTIVITY_TYPES, PROJECT_STATUSES, TASK_PRIORITIES, TASK_STATUSES } from '../constants/data'
import type { TeamFlowSeedData } from '../types'

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value)
    }
    seen.add(value)
  }

  return [...duplicates]
}

export function validateSeedData(seedData: TeamFlowSeedData): string[] {
  const errors: string[] = []
  const userIds = new Set(seedData.users.map((user) => user.id))
  const projectIds = new Set(seedData.projects.map((project) => project.id))
  const taskIds = new Set(seedData.tasks.map((task) => task.id))
  const allIds = [
    ...seedData.users.map((user) => user.id),
    ...seedData.projects.map((project) => project.id),
    ...seedData.tasks.map((task) => task.id),
    ...seedData.activities.map((activity) => activity.id),
  ]

  for (const duplicateId of duplicateValues(allIds)) {
    errors.push(`Duplicate seed-data ID: ${duplicateId}`)
  }

  for (const project of seedData.projects) {
    if (!PROJECT_STATUSES.includes(project.status)) {
      errors.push(`Invalid project status for ${project.id}: ${project.status}`)
    }

    for (const memberId of project.memberIds) {
      if (!userIds.has(memberId)) {
        errors.push(`Unknown member ${memberId} referenced by project ${project.id}`)
      }
    }
  }

  for (const task of seedData.tasks) {
    if (!projectIds.has(task.projectId)) {
      errors.push(`Unknown project ${task.projectId} referenced by task ${task.id}`)
    }

    if (!userIds.has(task.assigneeId)) {
      errors.push(`Unknown assignee ${task.assigneeId} referenced by task ${task.id}`)
    }

    if (!TASK_STATUSES.includes(task.status)) {
      errors.push(`Invalid task status for ${task.id}: ${task.status}`)
    }

    if (!TASK_PRIORITIES.includes(task.priority)) {
      errors.push(`Invalid task priority for ${task.id}: ${task.priority}`)
    }
  }

  for (const activity of seedData.activities) {
    if (!userIds.has(activity.userId)) {
      errors.push(`Unknown user ${activity.userId} referenced by activity ${activity.id}`)
    }

    if (activity.projectId && !projectIds.has(activity.projectId)) {
      errors.push(`Unknown project ${activity.projectId} referenced by activity ${activity.id}`)
    }

    if (activity.taskId && !taskIds.has(activity.taskId)) {
      errors.push(`Unknown task ${activity.taskId} referenced by activity ${activity.id}`)
    }

    if (!ACTIVITY_TYPES.includes(activity.type)) {
      errors.push(`Invalid activity type for ${activity.id}: ${activity.type}`)
    }

    if (activity.projectId && activity.taskId) {
      const task = seedData.tasks.find((candidate) => candidate.id === activity.taskId)

      if (task && task.projectId !== activity.projectId) {
        errors.push(`Activity ${activity.id} references a task from a different project`)
      }
    }
  }

  return errors
}

export function assertValidSeedData(seedData: TeamFlowSeedData): void {
  const errors = validateSeedData(seedData)

  if (errors.length > 0) {
    throw new Error(`Invalid TeamFlow seed data:\n${errors.join('\n')}`)
  }
}
