import type { Project, ProjectStatus } from '../types'

export type ProjectStatusFilter = ProjectStatus | 'all'

export function filterProjects(
  projects: Project[],
  search: string,
  status: ProjectStatusFilter,
): Project[] {
  const normalizedSearch = search.trim().toLowerCase()

  return projects.filter((project) => {
    const matchesSearch =
      !normalizedSearch ||
      project.name.toLowerCase().includes(normalizedSearch) ||
      project.description.toLowerCase().includes(normalizedSearch)
    const matchesStatus = status === 'all' || project.status === status

    return matchesSearch && matchesStatus
  })
}
