import { useId, useState, type FormEvent } from 'react'
import { TASK_PRIORITIES, TASK_STATUSES } from '../../constants/data'
import type { TaskDraft } from '../../context/taskContextValue'
import type { Project, TaskPriority, TaskStatus, User } from '../../types'
import {
  validateTaskForm,
  type TaskFormErrors,
  type TaskFormValues,
} from '../../utils/taskValidation'
import { taskPriorityLabels, taskStatusLabels } from '../../utils/taskLabels'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Select, type SelectOption } from '../common/Select'

export type { TaskFormErrors, TaskFormValues } from '../../utils/taskValidation'

export interface TaskFormProps {
  formId: string
  projects: Project[]
  assignees: User[]
  initialValues?: TaskDraft
  submitLabel: string
  onSubmit: (values: TaskDraft) => void
  onCancel: () => void
}

const emptyFormValues: TaskFormValues = {
  title: '',
  description: '',
  projectId: '',
  status: 'todo',
  priority: 'medium',
  assigneeId: '',
  dueDate: '',
}

const statusOptions: SelectOption[] = TASK_STATUSES.map((status) => ({
  label: taskStatusLabels[status],
  value: status,
}))

const priorityOptions: SelectOption[] = TASK_PRIORITIES.map((priority) => ({
  label: taskPriorityLabels[priority],
  value: priority,
}))

function getInitialValues(initialValues?: TaskDraft): TaskFormValues {
  if (!initialValues) {
    return { ...emptyFormValues }
  }

  return {
    title: initialValues.title,
    description: initialValues.description,
    projectId: initialValues.projectId,
    status: initialValues.status,
    priority: initialValues.priority,
    assigneeId: initialValues.assigneeId,
    dueDate: initialValues.dueDate,
  }
}

export function TaskForm({
  formId,
  projects,
  assignees,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(() => getInitialValues(initialValues))
  const [errors, setErrors] = useState<TaskFormErrors>({})
  const descriptionId = useId()
  const descriptionErrorId = `${descriptionId}-error`

  const projectOptions: SelectOption[] = projects.map((project) => ({
    label: project.name,
    value: project.id,
  }))
  const assigneeOptions: SelectOption[] = assignees.map((assignee) => ({
    label: `${assignee.name} — ${assignee.role}`,
    value: assignee.id,
  }))

  function updateValue<Key extends keyof TaskFormValues>(key: Key, value: TaskFormValues[Key]) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }))
    setErrors((currentErrors) => {
      if (!currentErrors[key]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[key]
      return nextErrors
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validateTaskForm(values)
    setErrors(validationErrors)

    if (
      Object.keys(validationErrors).length > 0 ||
      !values.projectId ||
      !values.status ||
      !values.priority ||
      !values.assigneeId ||
      !values.dueDate
    ) {
      return
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      projectId: values.projectId,
      status: values.status,
      priority: values.priority,
      assigneeId: values.assigneeId,
      dueDate: values.dueDate,
    })
  }

  return (
    <form id={formId} noValidate onSubmit={handleSubmit}>
      <div className="vstack gap-3">
        <Input
          label="Task title"
          name="title"
          value={values.title}
          onChange={(event) => updateValue('title', event.target.value)}
          placeholder="e.g. Review the onboarding flow"
          required
          error={errors.title}
          autoComplete="off"
        />

        <div className="field-group">
          <label htmlFor={descriptionId} className="form-label">
            Description{' '}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
            <span className="visually-hidden"> required</span>
          </label>
          <textarea
            id={descriptionId}
            name="description"
            className={`form-control${errors.description ? ' is-invalid' : ''}`}
            value={values.description}
            onChange={(event) => updateValue('description', event.target.value)}
            placeholder="Describe the work that needs to be completed"
            rows={4}
            required
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? descriptionErrorId : undefined}
          />
          {errors.description ? (
            <div id={descriptionErrorId} className="field-error" role="alert">
              <span aria-hidden="true">!</span>
              <span>{errors.description}</span>
            </div>
          ) : null}
        </div>

        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <Select
              label="Project"
              name="projectId"
              value={values.projectId}
              onChange={(event) => updateValue('projectId', event.target.value)}
              options={projectOptions}
              placeholder="Select project"
              required
              error={errors.projectId}
            />
          </div>
          <div className="col-12 col-sm-6">
            <Select
              label="Status"
              name="status"
              value={values.status}
              onChange={(event) => updateValue('status', event.target.value as TaskStatus | '')}
              options={statusOptions}
              placeholder="Select status"
              required
              error={errors.status}
            />
          </div>
          <div className="col-12 col-sm-6">
            <Select
              label="Priority"
              name="priority"
              value={values.priority}
              onChange={(event) => updateValue('priority', event.target.value as TaskPriority | '')}
              options={priorityOptions}
              placeholder="Select priority"
              required
              error={errors.priority}
            />
          </div>
          <div className="col-12 col-sm-6">
            <Select
              label="Assignee"
              name="assigneeId"
              value={values.assigneeId}
              onChange={(event) => updateValue('assigneeId', event.target.value)}
              options={assigneeOptions}
              placeholder="Select assignee"
              required
              error={errors.assigneeId}
            />
          </div>
          <div className="col-12">
            <Input
              label="Due date"
              name="dueDate"
              type="date"
              value={values.dueDate}
              onChange={(event) => updateValue('dueDate', event.target.value)}
              required
              error={errors.dueDate}
            />
          </div>
        </div>
      </div>

      <div className="task-form__actions d-flex flex-wrap justify-content-end gap-2 mt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
