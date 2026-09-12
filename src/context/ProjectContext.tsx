import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import { projects as seedProjects } from '../data/projects'
import { getItem, setItem } from '../services/storage'
import { isProjectArray } from '../services/storageValidation'
import type { Project } from '../types'
import { useActivities } from './useActivities'
import { ProjectContext, type ProjectContextValue, type ProjectDraft } from './projectContextValue'

function createProjectId(existingProjects: Project[]): string {
  const existingIds = new Set(existingProjects.map((project) => project.id))
  const randomId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  let candidate = `project-${randomId}`
  let suffix = 1

  while (existingIds.has(candidate)) {
    candidate = `project-${randomId}-${suffix}`
    suffix += 1
  }

  return candidate
}

export interface ProjectProviderProps {
  children: ReactNode
}

interface InitialProjectsState {
  projects: Project[]
  error: string | null
}

function readInitialProjectsState(): InitialProjectsState {
  let loadIssue: string | null = null
  const projects = getItem<Project[]>(STORAGE_KEYS.projects, isProjectArray, (issue) => {
    loadIssue ??= issue.message
  }) ?? [...seedProjects]

  return { projects, error: loadIssue }
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const { recordActivity } = useActivities()
  const [initialState] = useState<InitialProjectsState>(readInitialProjectsState)
  const [projects, setProjects] = useState<Project[]>(initialState.projects)
  const [error, setError] = useState<string | null>(initialState.error)
  const isLoading = false

  const persistProjects = useCallback((nextProjects: Project[]) => {
    if (!setItem(STORAGE_KEYS.projects, nextProjects)) {
      setError(
        `We couldn't save data for ${STORAGE_KEYS.projects}. Your latest changes are currently in memory only.`,
      )
      return
    }

    setError(null)
  }, [])

  const retryPersistence = useCallback(() => {
    persistProjects(projects)
  }, [persistProjects, projects])

  const createProject = useCallback(
    (project: ProjectDraft) => {
      const newProject: Project = {
        ...project,
        id: createProjectId(projects),
        progress: 0,
      }

      const nextProjects = [newProject, ...projects]
      setProjects(nextProjects)
      persistProjects(nextProjects)
      recordActivity({
        type: 'project-created',
        description: `created the ${newProject.name} project`,
        projectId: newProject.id,
      })
      return newProject
    },
    [persistProjects, projects, recordActivity],
  )

  const updateProject = useCallback(
    (projectId: string, updates: Partial<Omit<Project, 'id'>>) => {
      const project = projects.find((candidate) => candidate.id === projectId)

      if (!project) {
        return
      }

      const nextProjects = projects.map((currentProject) =>
        currentProject.id === projectId
          ? { ...currentProject, ...updates, id: currentProject.id }
          : currentProject,
      )
      setProjects(nextProjects)
      persistProjects(nextProjects)
      recordActivity({
        type: 'project-updated',
        description: `updated the ${project.name} project`,
        projectId: project.id,
      })
    },
    [persistProjects, projects, recordActivity],
  )

  const syncProjectProgress = useCallback(
    (progressByProject: Readonly<Record<string, number>>) => {
      const nextProjects = projects.map((project) => {
        const nextProgress = progressByProject[project.id]
        return nextProgress === undefined || nextProgress === project.progress
          ? project
          : { ...project, progress: nextProgress }
      })

      if (nextProjects.every((project, index) => project === projects[index])) {
        return
      }

      setProjects(nextProjects)
      persistProjects(nextProjects)
    },
    [persistProjects, projects],
  )

  const deleteProject = useCallback(
    (projectId: string) => {
      const project = projects.find((candidate) => candidate.id === projectId)

      if (!project) {
        return
      }

      const nextProjects = projects.filter((currentProject) => currentProject.id !== projectId)
      setProjects(nextProjects)
      persistProjects(nextProjects)
      recordActivity({
        type: 'project-deleted',
        description: `deleted the ${project.name} project`,
        projectId: project.id,
      })
    },
    [persistProjects, projects, recordActivity],
  )

  const value = useMemo<ProjectContextValue>(
    () => ({
      projects,
      isLoading,
      error,
      retryPersistence,
      createProject,
      updateProject,
      syncProjectProgress,
      deleteProject,
    }),
    [
      createProject,
      deleteProject,
      error,
      isLoading,
      projects,
      retryPersistence,
      syncProjectProgress,
      updateProject,
    ],
  )

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
