import { createContext } from 'react'
import type { Project } from '../types'

export type ProjectDraft = Omit<Project, 'id' | 'progress'>

export interface ProjectContextValue {
  projects: Project[]
  createProject: (project: ProjectDraft) => Project
  updateProject: (projectId: string, updates: Partial<Omit<Project, 'id'>>) => void
  deleteProject: (projectId: string) => void
}

export const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)
