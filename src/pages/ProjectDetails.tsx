import { useRef, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Modal } from '../components/common/Modal'
import { ProjectDeleteModal } from '../components/projects/ProjectDeleteModal'
import { ProjectForm } from '../components/projects/ProjectForm'
import { useProjects } from '../context/useProjects'
import { useTasks } from '../context/useTasks'
import { activities } from '../data/activities'
import { users } from '../data/users'
import type { ProjectDraft } from '../context/projectContextValue'
import type { ProjectStatus, Task, User } from '../types'
import { formatProjectDate, formatProjectDateTime } from '../utils/projectDate'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'members', label: 'Members' },
  { id: 'activity', label: 'Activity' },
] as const

type ProjectDetailsTab = (typeof tabs)[number]['id']

function getTabPanelId(tab: ProjectDetailsTab) {
  return `project-panel-${tab}`
}

function getTabId(tab: ProjectDetailsTab) {
  return `project-tab-${tab}`
}

function ProjectNotFound() {
  return (
    <div className="project-details-page project-details-page__not-found">
      <Card title="Project Not Found" subtitle="We could not find a project for this URL.">
        <p className="text-muted-strong">
          The project may have been removed, or the project ID may be incorrect.
        </p>
        <Link to="/projects" className="btn btn-teamflow-primary">
          Back to Projects
        </Link>
      </Card>
    </div>
  )
}

function ProjectOverview({
  description,
  status,
  progress,
  dueDate,
  memberCount,
}: {
  description: string
  status: ProjectStatus
  progress: number
  dueDate: string
  memberCount: number
}) {
  return (
    <div className="row g-4">
      <div className="col-12 col-lg-7">
        <Card title="Overview" subtitle="Project purpose and current delivery status.">
          <p className="project-details-page__description mb-0">{description}</p>
        </Card>
      </div>
      <div className="col-12 col-lg-5">
        <Card title="Project metadata" subtitle="Key details for this project.">
          <dl className="project-details-page__metadata mb-0">
            <div>
              <dt>Status</dt>
              <dd>
                <Badge variant={status} />
              </dd>
            </div>
            <div>
              <dt>Progress</dt>
              <dd>{progress}% complete</dd>
            </div>
            <div>
              <dt>Due date</dt>
              <dd>{formatProjectDate(dueDate)}</dd>
            </div>
            <div>
              <dt>Members</dt>
              <dd>{memberCount}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}

function ProjectTasks({ projectTasks }: { projectTasks: Task[] }) {
  return (
    <Card
      title="Project tasks"
      subtitle={`${projectTasks.length} tasks currently associated with this project.`}
    >
      {projectTasks.length > 0 ? (
        <ul className="project-details-page__task-list list-unstyled mb-0">
          {projectTasks.map((task) => {
            const assignee = users.find((user) => user.id === task.assigneeId)

            return (
              <li key={task.id} className="project-details-page__task-item">
                <div className="project-details-page__task-copy">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className="project-details-page__task-meta">
                  <Badge variant={task.status} />
                  <Badge variant={task.priority} />
                  <span>
                    Assignee: <strong>{assignee?.name ?? 'Unknown user'}</strong>
                  </span>
                  <span>Due {formatProjectDate(task.dueDate)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-muted-strong mb-0">No tasks are associated with this project yet.</p>
      )}
      <div className="alert alert-info mt-4 mb-0" role="note">
        Task creation and editing will be available in the Tasks module.
      </div>
    </Card>
  )
}

function ProjectMembers({ memberIds }: { memberIds: string[] }) {
  const members = memberIds
    .map((memberId) => users.find((user) => user.id === memberId))
    .filter((user): user is User => user !== undefined)

  return (
    <Card title="Project members" subtitle="People currently assigned to this project.">
      {members.length > 0 ? (
        <ul className="project-details-page__member-list list-unstyled mb-0">
          {members.map((member) => (
            <li key={member.id} className="project-details-page__member-item">
              <img src={member.avatar} alt={`${member.name} avatar`} loading="lazy" />
              <div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <a href={`mailto:${member.email}`}>{member.email}</a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-strong mb-0">No members are assigned to this project.</p>
      )}
    </Card>
  )
}

function ProjectActivity({ projectId }: { projectId: string }) {
  const projectActivities = activities.filter((activity) => activity.projectId === projectId)

  return (
    <Card title="Project activity" subtitle="Recent updates connected to this project.">
      {projectActivities.length > 0 ? (
        <ol className="project-details-page__activity-list list-unstyled mb-0">
          {projectActivities.map((activity) => {
            const actor = users.find((user) => user.id === activity.userId)

            return (
              <li key={activity.id} className="project-details-page__activity-item">
                <span className="project-details-page__activity-marker" aria-hidden="true" />
                <div>
                  <p>
                    <strong>{actor?.name ?? 'Unknown user'}</strong> {activity.description}
                  </p>
                  <time dateTime={activity.timestamp}>
                    {formatProjectDateTime(activity.timestamp)}
                  </time>
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="text-muted-strong mb-0">No project-specific activity is available yet.</p>
      )}
    </Card>
  )
}

export function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { projects, updateProject, deleteProject } = useProjects()
  const { tasks } = useTasks()
  const [activeTab, setActiveTab] = useState<ProjectDetailsTab>('overview')
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const project = projects.find((candidate) => candidate.id === projectId)

  if (!project) {
    return <ProjectNotFound />
  }

  const currentProject = project
  const relatedTasks = tasks.filter((task) => task.projectId === currentProject.id)
  const relatedActivities = activities.filter(
    (activity) => activity.projectId === currentProject.id,
  )

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, tabIndex: number) {
    let nextTabIndex: number

    if (event.key === 'ArrowRight') {
      nextTabIndex = (tabIndex + 1) % tabs.length
    } else if (event.key === 'ArrowLeft') {
      nextTabIndex = (tabIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      nextTabIndex = 0
    } else if (event.key === 'End') {
      nextTabIndex = tabs.length - 1
    } else {
      return
    }

    event.preventDefault()
    const nextTab = tabs[nextTabIndex]
    setActiveTab(nextTab.id)
    tabRefs.current[nextTabIndex]?.focus()
  }

  function handleEditSubmit(values: ProjectDraft) {
    updateProject(currentProject.id, values)
    setEditOpen(false)
  }

  function handleDeleteConfirm() {
    deleteProject(currentProject.id)
    setDeleteOpen(false)
    navigate('/projects', { replace: true })
  }

  return (
    <div className="project-details-page">
      <Link to="/projects" className="project-details-page__back btn btn-teamflow-ghost btn-sm">
        <span aria-hidden="true">←</span> Back to Projects
      </Link>

      <header className="project-details-page__header">
        <div className="project-details-page__heading">
          <p className="section-kicker">Project details</p>
          <h2>{currentProject.name}</h2>
          <p>{currentProject.description}</p>
        </div>
        <div className="project-details-page__actions d-flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => setEditOpen(true)}>
            Edit Project
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete Project
          </Button>
        </div>
      </header>

      <section className="project-details-page__summary" aria-label="Project summary">
        <div>
          <dt>Status</dt>
          <dd>
            <Badge variant={currentProject.status} />
          </dd>
        </div>
        <div>
          <dt>Progress</dt>
          <dd>
            <strong>{currentProject.progress}%</strong>
            <div
              className="progress mt-2"
              role="progressbar"
              aria-label={`${currentProject.name} progress`}
              aria-valuenow={currentProject.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar" style={{ width: `${currentProject.progress}%` }} />
            </div>
          </dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd>{formatProjectDate(currentProject.dueDate)}</dd>
        </div>
        <div>
          <dt>Members</dt>
          <dd>{currentProject.memberIds.length}</dd>
        </div>
      </section>

      <div className="project-details-page__tabs" role="tablist" aria-label="Project sections">
        {tabs.map((tab, tabIndex) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tabIndex] = element
            }}
            id={getTabId(tab.id)}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={getTabPanelId(tab.id)}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`project-details-page__tab${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, tabIndex)}
          >
            {tab.label}
            {tab.id === 'tasks' ? (
              <span className="visually-hidden"> ({relatedTasks.length})</span>
            ) : null}
            {tab.id === 'activity' ? (
              <span className="visually-hidden"> ({relatedActivities.length})</span>
            ) : null}
          </button>
        ))}
      </div>

      <div
        id={getTabPanelId(activeTab)}
        role="tabpanel"
        aria-labelledby={getTabId(activeTab)}
        tabIndex={0}
        className="project-details-page__panel"
      >
        {activeTab === 'overview' ? (
          <ProjectOverview
            description={currentProject.description}
            status={currentProject.status}
            progress={currentProject.progress}
            dueDate={currentProject.dueDate}
            memberCount={currentProject.memberIds.length}
          />
        ) : null}
        {activeTab === 'tasks' ? <ProjectTasks projectTasks={relatedTasks} /> : null}
        {activeTab === 'members' ? <ProjectMembers memberIds={currentProject.memberIds} /> : null}
        {activeTab === 'activity' ? <ProjectActivity projectId={currentProject.id} /> : null}
      </div>

      <Modal open={editOpen} title="Edit project" onClose={() => setEditOpen(false)} size="lg">
        <ProjectForm
          key={`edit-${currentProject.id}`}
          formId="project-details-form"
          members={users}
          initialValues={currentProject}
          submitLabel="Save changes"
          onSubmit={handleEditSubmit}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <ProjectDeleteModal
        project={deleteOpen ? currentProject : null}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
