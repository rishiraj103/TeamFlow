import { useMemo, useState } from 'react'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { Modal } from '../components/common/Modal'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskDeleteModal } from '../components/tasks/TaskDeleteModal'
import { TaskFilters } from '../components/tasks/TaskFilters'
import { TaskForm } from '../components/tasks/TaskForm'
import type { TaskDraft } from '../context/taskContextValue'
import { useProjects } from '../context/useProjects'
import { useTasks } from '../context/useTasks'
import { users } from '../data/users'
import type { Task, TaskFilterState } from '../types'
import { DEFAULT_TASK_FILTERS, filterTasks } from '../utils/taskFilters'

type TaskFormMode = { type: 'create' } | { type: 'edit'; task: Task } | null

const formId = 'task-form'

export function Tasks() {
  const {
    tasks,
    isLoading,
    error,
    retryPersistence,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  } = useTasks()
  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
    retryPersistence: retryProjects,
  } = useProjects()
  const [formMode, setFormMode] = useState<TaskFormMode>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [filters, setFilters] = useState<TaskFilterState>(() => ({ ...DEFAULT_TASK_FILTERS }))

  const visibleTasks = useMemo(() => filterTasks(tasks, filters), [filters, tasks])

  function handleFormSubmit(values: TaskDraft) {
    if (formMode?.type === 'edit') {
      updateTask(formMode.task.id, values)
    } else {
      createTask(values)
    }

    setFormMode(null)
  }

  function handleDeleteConfirmation() {
    if (!deleteTarget) {
      return
    }

    deleteTask(deleteTarget.id)
    setDeleteTarget(null)
  }

  function updateFilters(updates: Partial<TaskFilterState>) {
    setFilters((currentFilters) => ({ ...currentFilters, ...updates }))
  }

  function resetFilters() {
    setFilters({ ...DEFAULT_TASK_FILTERS })
  }

  const formTitle = formMode?.type === 'edit' ? 'Edit task' : 'New task'
  const formSubmitLabel = formMode?.type === 'edit' ? 'Save changes' : 'Create task'
  const formInitialValues = formMode?.type === 'edit' ? formMode.task : undefined
  const taskCountLabel = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`
  const isDataLoading = isLoading || projectsLoading
  const dataError = [error, projectsError].find((message): message is string => message !== null)

  function retryTaskDataPersistence() {
    retryPersistence()
    retryProjects()
  }

  if (isDataLoading) {
    return <LoadingState label="Loading tasks..." />
  }

  return (
    <div className="tasks-page">
      <header className="tasks-page__header d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-kicker">Workspace</p>
          <h2 className="tasks-page__title">Tasks</h2>
          <p className="text-muted-strong mb-0">{taskCountLabel} across the TeamFlow workspace.</p>
        </div>
        <Button type="button" onClick={() => setFormMode({ type: 'create' })}>
          <span aria-hidden="true">+</span> Create Task
        </Button>
      </header>

      {dataError ? (
        <ErrorState
          title="Task data needs attention"
          description={dataError}
          action={
            <Button variant="outline" onClick={retryTaskDataPersistence}>
              Try saving again
            </Button>
          }
          className="mb-4"
        />
      ) : null}

      <TaskFilters
        filters={filters}
        projects={projects}
        assignees={users}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      <div className="tasks-page__result-summary mb-3">
        Showing {visibleTasks.length} of {tasks.length} tasks
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet."
          description="Create your first task to start organizing work for your team."
          action={<Button onClick={() => setFormMode({ type: 'create' })}>Create Task</Button>}
        />
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          title="No tasks match your current filters."
          description="Try a different search or reset the filters to see all tasks."
          action={
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <section aria-label="Task list">
          <div className="row g-4">
            {visibleTasks.map((task) => (
              <div key={task.id} className="col-12 col-md-6 col-xxl-4">
                <TaskCard
                  task={task}
                  project={projects.find((project) => project.id === task.projectId)}
                  assignee={users.find((user) => user.id === task.assigneeId)}
                  onEdit={(selectedTask) => setFormMode({ type: 'edit', task: selectedTask })}
                  onDelete={setDeleteTarget}
                  onStatusChange={updateTaskStatus}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <Modal open={formMode !== null} title={formTitle} onClose={() => setFormMode(null)} size="lg">
        <TaskForm
          key={`${formMode?.type ?? 'closed'}-${formMode?.type === 'edit' ? formMode.task.id : 'new'}`}
          formId={formId}
          projects={projects}
          assignees={users}
          initialValues={formInitialValues}
          submitLabel={formSubmitLabel}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormMode(null)}
        />
      </Modal>

      <TaskDeleteModal
        task={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmation}
      />
    </div>
  )
}
