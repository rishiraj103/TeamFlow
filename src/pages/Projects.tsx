import { useMemo, useState } from 'react'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { Input } from '../components/common/Input'
import { Modal } from '../components/common/Modal'
import { Select, type SelectOption } from '../components/common/Select'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectDeleteModal } from '../components/projects/ProjectDeleteModal'
import { ProjectForm, type ProjectFormValues } from '../components/projects/ProjectForm'
import { users } from '../data/users'
import { useProjects } from '../context/useProjects'
import type { Project, ProjectStatus } from '../types'
import { filterProjects, type ProjectStatusFilter } from '../utils/projectFilters'

type ProjectFormMode = { type: 'create' } | { type: 'edit'; project: Project } | null

const statusFilterOptions: SelectOption[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
]

const formId = 'project-form'

export function Projects() {
  const { projects, createProject, updateProject, deleteProject } = useProjects()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ProjectStatusFilter>('all')
  const [formMode, setFormMode] = useState<ProjectFormMode>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const visibleProjects = useMemo(
    () => filterProjects(projects, search, status),
    [projects, search, status],
  )

  function openCreateForm() {
    setFormMode({ type: 'create' })
  }

  function openEditForm(project: Project) {
    setFormMode({ type: 'edit', project })
  }

  function handleFormSubmit(values: ProjectFormValues) {
    if (!values.status) {
      return
    }

    const projectValues = {
      name: values.name,
      description: values.description,
      status: values.status,
      dueDate: values.dueDate,
      memberIds: values.memberIds,
    }

    if (formMode?.type === 'edit') {
      updateProject(formMode.project.id, projectValues)
    } else {
      createProject(projectValues)
    }

    setFormMode(null)
  }

  function handleDeleteConfirmation() {
    if (!deleteTarget) {
      return
    }

    deleteProject(deleteTarget.id)
    setDeleteTarget(null)
  }

  function clearFilters() {
    setSearch('')
    setStatus('all')
  }

  const formTitle = formMode?.type === 'edit' ? 'Edit project' : 'New project'
  const formSubmitLabel = formMode?.type === 'edit' ? 'Save changes' : 'Create project'
  const formInitialValues = formMode?.type === 'edit' ? formMode.project : undefined
  const projectCountLabel = `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`

  return (
    <div className="projects-page">
      <header className="projects-page__header d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-kicker">Workspace</p>
          <h2 className="projects-page__title">Projects</h2>
          <p className="text-muted-strong mb-0">
            {projectCountLabel} across the TeamFlow workspace.
          </p>
        </div>
        <Button type="button" onClick={openCreateForm}>
          <span aria-hidden="true">+</span> New Project
        </Button>
      </header>

      <section className="projects-page__filters" aria-label="Project filters">
        <div className="row align-items-end g-3 mb-4">
          <div className="col-12 col-lg-8">
            <Input
              label="Search projects"
              name="project-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by project name or description"
            />
          </div>
          <div className="col-12 col-sm-8 col-lg-4">
            <Select
              label="Status"
              name="project-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ProjectStatus | 'all')}
              options={statusFilterOptions}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </section>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet."
          description="Create your first project to start organizing work for your team."
          action={<Button onClick={openCreateForm}>New Project</Button>}
        />
      ) : visibleProjects.length === 0 ? (
        <EmptyState
          title="No projects match your current filters."
          description="Try a different search term or reset the status filter."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <section aria-label="Project list">
          <div className="projects-page__result-summary mb-3">
            Showing {visibleProjects.length} of {projects.length} projects
          </div>
          <div className="row g-4">
            {visibleProjects.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-xxl-4">
                <ProjectCard project={project} onEdit={openEditForm} onDelete={setDeleteTarget} />
              </div>
            ))}
          </div>
        </section>
      )}

      <Modal open={formMode !== null} title={formTitle} onClose={() => setFormMode(null)} size="lg">
        <ProjectForm
          key={`${formMode?.type ?? 'closed'}-${formMode?.type === 'edit' ? formMode.project.id : 'new'}`}
          formId={formId}
          members={users}
          initialValues={formInitialValues}
          submitLabel={formSubmitLabel}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormMode(null)}
        />
      </Modal>

      <ProjectDeleteModal
        project={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmation}
      />
    </div>
  )
}
