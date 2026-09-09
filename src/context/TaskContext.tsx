import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import { tasks as seedTasks } from '../data/tasks'
import { getItem, setItem } from '../services/storage'
import { isTaskArray } from '../services/storageValidation'
import type { Task, TaskStatus } from '../types'
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
      return newTask
    },
    [tasks],
  )

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates, id: task.id } : task,
      ),
    )
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }, [])

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    )
  }, [])

  const value = useMemo<TaskContextValue>(
    () => ({ tasks, createTask, updateTask, deleteTask, updateTaskStatus }),
    [createTask, deleteTask, tasks, updateTask, updateTaskStatus],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
