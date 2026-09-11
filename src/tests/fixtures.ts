import type { Project, Task } from '../types'

export const fixtureProjects: Project[] = [
  {
    id: 'project-one',
    name: 'Alpha Project',
    description: 'A customer-facing alpha release.',
    status: 'active',
    progress: 25,
    dueDate: '2026-10-10',
    memberIds: ['user-amelia-chen'],
  },
  {
    id: 'project-two',
    name: 'Beta Project',
    description: 'An archived internal beta.',
    status: 'archived',
    progress: 75,
    dueDate: '2026-11-10',
    memberIds: ['user-priya-shah'],
  },
]

export const fixtureTasks: Task[] = [
  {
    id: 'task-one',
    projectId: 'project-one',
    title: 'Prepare release notes',
    description: 'Write the notes for the alpha launch.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user-amelia-chen',
    dueDate: '2026-09-20',
  },
  {
    id: 'task-two',
    projectId: 'project-one',
    title: 'Review onboarding copy',
    description: 'Check the beta onboarding experience.',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: 'user-priya-shah',
    dueDate: '2026-09-25',
  },
  {
    id: 'task-three',
    projectId: 'project-two',
    title: 'Close beta checklist',
    description: 'Complete the final beta checklist.',
    status: 'completed',
    priority: 'low',
    assigneeId: 'user-amelia-chen',
    dueDate: '2026-09-30',
  },
]
