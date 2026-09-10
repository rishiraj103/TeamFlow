import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import { tasks as seedTasks } from '../data/tasks'
import { getItem, setItem } from '../services/storage'
import { isTaskArray } from '../services/storageValidation'
import type { Task, TaskStatus } from '../types'
import { taskStatusLabels } from '../utils/taskLabels'
import { useActivities } from './useActivities'
import { TaskContext, type TaskContextValue, type TaskDraft } from './taskContextValue'

function createTaskId(existingTasks: Task[]): string {
  const existingIds = new Set(existingTasks.map((task) => task.id))
  const randomId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  let candidate = `task-${randomId}`
  let suffix = 1

  while (existingIds.has(candidate)) {
    candidate = `task-${randomId}-${suffix}`
    suffix += 1
  }

  return candidate
}

export interface TaskProviderProps {
  children: ReactNode
}

function readInitialTasks(): Task[] {
  return getItem<Task[]>(STORAGE_KEYS.tasks, isTaskArray) ?? [...seedTasks]
}

export function TaskProvider({ children }: TaskProviderProps) {
  const { recordActivity } = useActivities()
  const [tasks, setTasks] = useState<Task[]>(readInitialTasks)
  const initialTasks = useRef(tasks)

  useEffect(() => {
    if (tasks === initialTasks.current) {
      return
    }

    setItem(STORAGE_KEYS.tasks, tasks)
  }, [tasks])

  const createTask = useCallback(
    (task: TaskDraft) => {
      const newTask: Task = {
        ...task,
        id: createTaskId(tasks),
      }

      setTasks((currentTasks) => [newTask, ...currentTasks])
      recordActivity({
        type: 'task-created',
        description: `created the ${newTask.title} task`,
        projectId: newTask.projectId,
        taskId: newTask.id,
      })
      return newTask
    },
    [recordActivity, tasks],
  )

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
      const task = tasks.find((candidate) => candidate.id === taskId)

      if (!task) {
        return
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === taskId
            ? { ...currentTask, ...updates, id: currentTask.id }
            : currentTask,
        ),
      )

      const statusChanged = updates.status !== undefined && updates.status !== task.status
      const activityType = statusChanged
        ? updates.status === 'completed'
          ? 'task-completed'
          : 'task-status-changed'
        : 'task-updated'
      const description = statusChanged
        ? updates.status === 'completed'
          ? `completed the ${task.title} task`
          : `changed the ${task.title} task status to ${taskStatusLabels[updates.status!]}`
        : `updated the ${task.title} task`

      recordActivity({
        type: activityType,
        description,
        projectId: task.projectId,
        taskId: task.id,
      })
    },
    [recordActivity, tasks],
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((candidate) => candidate.id === taskId)

      if (!task) {
        return
      }

      setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== taskId))
      recordActivity({
        type: 'task-deleted',
        description: `deleted the ${task.title} task`,
        projectId: task.projectId,
        taskId: task.id,
      })
    },
    [recordActivity, tasks],
  )

  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      const task = tasks.find((candidate) => candidate.id === taskId)

      if (!task || task.status === status) {
        return
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === taskId ? { ...currentTask, status } : currentTask,
        ),
      )

      recordActivity({
        type: status === 'completed' ? 'task-completed' : 'task-status-changed',
        description:
          status === 'completed'
            ? `completed the ${task.title} task`
            : `changed the ${task.title} task status to ${taskStatusLabels[status]}`,
        projectId: task.projectId,
        taskId: task.id,
      })
    },
    [recordActivity, tasks],
  )

  const value = useMemo<TaskContextValue>(
    () => ({ tasks, createTask, updateTask, deleteTask, updateTaskStatus }),
    [createTask, deleteTask, tasks, updateTask, updateTaskStatus],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
