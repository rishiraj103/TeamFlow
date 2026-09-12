import { createContext } from 'react'
import type { Task, TaskStatus } from '../types'

export type TaskDraft = Omit<Task, 'id'>

export interface TaskContextValue {
  tasks: Task[]
  createTask: (task: TaskDraft) => Task
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void
  deleteTask: (taskId: string) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined)
