import type {
  ACTIVITY_TYPES,
  PROJECT_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  USER_ROLES,
} from '../constants/data'

export type UserRole = (typeof USER_ROLES)[number]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  initials: string
}

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  dueDate: string
  memberIds: string[]
}

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  dueDate: string
}

export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export interface Activity {
  id: string
  userId: string
  type: ActivityType
  description: string
  timestamp: string
  projectId?: string
  taskId?: string
}

export interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  isInitializing: boolean
}

export type ThemePreference = 'light' | 'dark' | 'system'

export interface NotificationPreferences {
  email: boolean
  inApp: boolean
  taskAssignments: boolean
  projectUpdates: boolean
}

export type SortDirection = 'asc' | 'desc'
export type TaskSortField = 'dueDate' | 'priority' | 'status' | 'title'

export interface TaskFilterState {
  search: string
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  projectId: string | 'all'
  assigneeId: string | 'all'
  sortBy: TaskSortField
  sortDirection: SortDirection
}

export type ProjectSortField = 'dueDate' | 'name' | 'progress' | 'status'

export interface ProjectFilterState {
  search: string
  status: ProjectStatus | 'all'
  sortBy: ProjectSortField
  sortDirection: SortDirection
}

export interface TeamFlowSeedData {
  users: User[]
  projects: Project[]
  tasks: Task[]
  activities: Activity[]
}
