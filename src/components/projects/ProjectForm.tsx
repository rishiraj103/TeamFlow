import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { PROJECT_STATUSES } from '../../constants/data'
import type { ProjectDraft } from '../../context/projectContextValue'
import type { ProjectStatus, User } from '../../types'
import { validateProjectForm } from '../../utils/projectValidation'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Select, type SelectOption } from '../common/Select'

export interface ProjectFormValues {
  name: string
  description: string
  status: ProjectStatus | ''
  dueDate: string
  memberIds: string[]
}

export type ProjectFormErrors = Partial<Record<keyof ProjectFormValues, string>>

export interface ProjectFormProps {
  formId: string
  members: User[]
  initialValues?: ProjectDraft
  submitLabel: string
  onSubmit: (values: ProjectDraft) => void
  onCancel: () => void
}

const emptyFormValues: ProjectFormValues = {
  name: '',
  description: '',
  status: 'active',
  dueDate: '',
  memberIds: [],
}

const statusOptions: SelectOption[] = PROJECT_STATUSES.map((status) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1),
  value: status,
}))

function getInitialValues(initialValues?: ProjectDraft): ProjectFormValues {
  if (!initialValues) {
    return emptyFormValues
  }

  return {
    name: initialValues.name,
    description: initialValues.description,
    status: initialValues.status,
    dueDate: initialValues.dueDate,
    memberIds: [...initialValues.memberIds],
  }
}

export function ProjectForm({
  formId,
  members,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(() => getInitialValues(initialValues))
  const [errors, setErrors] = useState<ProjectFormErrors>({})
  const descriptionId = useId()
  const membersId = useId()
  const descriptionErrorId = `${descriptionId}-error`
  const membersErrorId = `${membersId}-error`

  function updateValue<Key extends keyof ProjectFormValues>(
    key: Key,
    value: ProjectFormValues[Key],
  ) {
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

  function handleMemberChange(event: ChangeEvent<HTMLSelectElement>) {
    updateValue(
      'memberIds',
      Array.from(event.target.selectedOptions, (option) => option.value),
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validateProjectForm(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0 || !values.status) {
      return
    }

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      status: values.status,
      dueDate: values.dueDate,
      memberIds: values.memberIds,
    })
  }

  const descriptionDescribedBy = errors.description ? descriptionErrorId : undefined
  const membersDescribedBy = errors.memberIds ? membersErrorId : undefined

  return (
    <form id={formId} noValidate onSubmit={handleSubmit}>
      <div className="vstack gap-3">
        <Input
          label="Project name"
          name="name"
          value={values.name}
          onChange={(event) => updateValue('name', event.target.value)}
          placeholder="e.g. Customer portal refresh"
          required
          error={errors.name}
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
            placeholder="Describe the project goal and scope"
            rows={4}
            required
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={descriptionDescribedBy}
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
              label="Status"
              name="status"
              value={values.status}
              onChange={(event) => updateValue('status', event.target.value as ProjectStatus | '')}
              options={statusOptions}
              placeholder="Select status"
              required
              error={errors.status}
            />
          </div>
          <div className="col-12 col-sm-6">
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

        <div className="field-group">
          <label htmlFor={membersId} className="form-label">
            Members{' '}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
            <span className="visually-hidden"> required</span>
          </label>
          <select
            id={membersId}
            name="memberIds"
            className={`form-select project-form__members${errors.memberIds ? ' is-invalid' : ''}`}
            value={values.memberIds}
            onChange={handleMemberChange}
            multiple
            size={Math.min(Math.max(members.length, 4), 6)}
            required
            aria-required="true"
            aria-invalid={errors.memberIds ? true : undefined}
            aria-describedby={membersDescribedBy}
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} — {member.role}
              </option>
            ))}
          </select>
          {errors.memberIds ? (
            <div id={membersErrorId} className="field-error" role="alert">
              <span aria-hidden="true">!</span>
              <span>{errors.memberIds}</span>
            </div>
          ) : (
            <div className="form-text field-helper">
              Select one or more people for this project.
            </div>
          )}
        </div>
      </div>

      <div className="project-form__actions d-flex flex-wrap justify-content-end gap-2 mt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
