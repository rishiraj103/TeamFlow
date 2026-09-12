import type { ProjectFormErrors, ProjectFormValues } from '../components/projects/ProjectForm'

export function validateProjectForm(values: ProjectFormValues): ProjectFormErrors {
  const errors: ProjectFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'Project name is required.'
  }

  if (!values.description.trim()) {
    errors.description = 'Project description is required.'
  }

  if (!values.status) {
    errors.status = 'Project status is required.'
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.'
  }

  if (values.memberIds.length === 0) {
    errors.memberIds = 'Select at least one team member.'
  }

  return errors
}
