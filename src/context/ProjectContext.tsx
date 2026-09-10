import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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

function readInitialProjects(): Project[] {
  return getItem<Project[]>(STORAGE_KEYS.projects, isProjectArray) ?? [...seedProjects]
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const { recordActivity } = useActivities()
  const [projects, setProjects] = useState<Project[]>(readInitialProjects)
  const initialProjects = useRef(projects)

  useEffect(() => {
    if (projects === initialProjects.current) {
      return
    }

    setItem(STORAGE_KEYS.projects, projects)
  }, [projects])

  const createProject = useCallback(
    (project: ProjectDraft) => {
      const newProject: Project = {
        ...project,
        id: createProjectId(projects),
        progress: 0,
      }

      setProjects((currentProjects) => [newProject, ...currentProjects])
      recordActivity({
        type: 'project-created',
        description: `created the ${newProject.name} project`,
        projectId: newProject.id,
      })
      return newProject
    },
    [projects, recordActivity],
  )

  const updateProject = useCallback(
    (projectId: string, updates: Partial<Omit<Project, 'id'>>) => {
      const project = projects.find((candidate) => candidate.id === projectId)

      if (!project) {
        return
      }

      setProjects((currentProjects) =>
        currentProjects.map((currentProject) =>
          currentProject.id === projectId
            ? { ...currentProject, ...updates, id: currentProject.id }
            : currentProject,
        ),
      )
      recordActivity({
        type: 'project-updated',
        description: `updated the ${project.name} project`,
        projectId: project.id,
      })
    },
    [projects, recordActivity],
  )

  const deleteProject = useCallback(
    (projectId: string) => {
      const project = projects.find((candidate) => candidate.id === projectId)

      if (!project) {
        return
      }

      setProjects((currentProjects) =>
        currentProjects.filter((currentProject) => currentProject.id !== projectId),
      )
      recordActivity({
        type: 'project-deleted',
        description: `deleted the ${project.name} project`,
        projectId: project.id,
      })
    },
    [projects, recordActivity],
  )

  const value = useMemo<ProjectContextValue>(
    () => ({ projects, createProject, updateProject, deleteProject }),
    [createProject, deleteProject, projects, updateProject],
  )

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
