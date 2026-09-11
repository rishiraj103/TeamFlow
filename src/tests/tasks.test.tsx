import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tasks } from '../pages/Tasks'
import { renderWithProviders } from './test-utils'

async function fillNewTaskForm() {
  const user = userEvent.setup()
  const projectSelect = screen.getAllByRole('combobox', { name: /^Project/ }).at(-1)
  const assigneeSelect = screen.getAllByRole('combobox', { name: /^Assignee/ }).at(-1)

  await user.type(screen.getByLabelText(/^Task title/), 'Write release checklist')
  await user.type(screen.getByLabelText(/^Description/), 'Document the final release steps.')
  await user.selectOptions(projectSelect!, 'project-marketplace-refresh')
  await user.selectOptions(assigneeSelect!, 'user-amelia-chen')
  await user.type(screen.getByLabelText(/^Due date/), '2027-02-15')
  await user.click(screen.getByRole('button', { name: 'Create task' }))
}

describe('task workflows', () => {
  it('renders seeded tasks and creates a new task', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tasks />, { initialEntries: ['/tasks'] })

    expect(
      screen.getByRole('heading', { name: 'Polish marketplace search filters' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create Task' }))
    await fillNewTaskForm()

    expect(
      await screen.findByRole('heading', { name: 'Write release checklist' }),
    ).toBeInTheDocument()
  })

  it('rejects an invalid task form with validation messages', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tasks />, { initialEntries: ['/tasks'] })

    await user.click(screen.getByRole('button', { name: 'Create Task' }))
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(screen.getByText('Task title is required.')).toBeInTheDocument()
    expect(screen.getByText('Task description is required.')).toBeInTheDocument()
    expect(screen.getByText('Select a project for this task.')).toBeInTheDocument()
    expect(screen.getByText('Select an assignee for this task.')).toBeInTheDocument()
    expect(screen.getByText('Choose a due date.')).toBeInTheDocument()
  })

  it('edits a task and updates its visible title', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tasks />, { initialEntries: ['/tasks'] })

    await user.click(screen.getByRole('button', { name: 'Edit Polish marketplace search filters' }))
    const titleInput = screen.getByLabelText(/^Task title/)
    await user.clear(titleInput)
    await user.type(titleInput, 'Polish search filters')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(
      await screen.findByRole('heading', { name: 'Polish search filters' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Polish marketplace search filters' }),
    ).not.toBeInTheDocument()
  })

  it('changes task status and deletes the task after confirmation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tasks />, { initialEntries: ['/tasks'] })
    const taskHeading = screen.getByRole('heading', { name: 'Polish marketplace search filters' })
    const taskCard = taskHeading.closest('section')

    expect(taskCard).not.toBeNull()
    const card = within(taskCard!)
    const statusSelect = card.getByRole('combobox', { name: /^Status/ })

    await user.selectOptions(statusSelect, 'completed')
    expect(statusSelect).toHaveValue('completed')

    await user.click(card.getByRole('button', { name: 'Delete Polish marketplace search filters' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Polish marketplace search filters')

    await user.click(screen.getByRole('button', { name: 'Delete task' }))
    expect(
      screen.queryByRole('heading', { name: 'Polish marketplace search filters' }),
    ).not.toBeInTheDocument()
  })
})
