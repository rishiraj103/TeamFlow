import { useState } from 'react'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { Modal } from '../components/common/Modal'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskDeleteModal } from '../components/tasks/TaskDeleteModal'
import { TaskForm } from '../components/tasks/TaskForm'
import type { TaskDraft } from '../context/taskContextValue'
import { useProjects } from '../context/useProjects'
import { useTasks } from '../context/useTasks'
import { users } from '../data/users'
import type { Task } from '../types'

type TaskFormMode = { type: 'create' } | { type: 'edit'; task: Task } | null

const formId = 'task-form'

export function Tasks() {
  const { tasks, createTask, updateTask, deleteTask, updateTaskStatus } = useTasks()
  const { projects } = useProjects()
  const [formMode, setFormMode] = useState<TaskFormMode>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)

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

  const formTitle = formMode?.type === 'edit' ? 'Edit task' : 'New task'
  const formSubmitLabel = formMode?.type === 'edit' ? 'Save changes' : 'Create task'
  const formInitialValues = formMode?.type === 'edit' ? formMode.task : undefined
  const taskCountLabel = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`

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

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet."
          description="Create your first task to start organizing work for your team."
          action={<Button onClick={() => setFormMode({ type: 'create' })}>Create Task</Button>}
        />
      ) : (
        <section aria-label="Task list">
          <div className="tasks-page__result-summary mb-3">Showing {tasks.length} tasks</div>
          <div className="row g-4">
            {tasks.map((task) => (
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
