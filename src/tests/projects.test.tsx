import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Projects } from '../pages/Projects'
import { renderWithProviders } from './test-utils'

async function fillProjectForm(name = 'Gamma Project') {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText(/^Project name/), name)
  await user.type(screen.getByLabelText(/^Description/), 'A new project for workflow testing.')
  await user.type(screen.getByLabelText(/^Due date/), '2027-01-15')
  await user.selectOptions(screen.getByLabelText(/^Members/), ['user-amelia-chen'])
  await user.click(screen.getByRole('button', { name: 'Create project' }))
}

describe('project workflows', () => {
  it('renders the seeded projects and creates a new project', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Projects />, { initialEntries: ['/projects'] })

    expect(screen.getByRole('link', { name: 'Marketplace Refresh' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pulse Mobile' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /new project/i }))
    await fillProjectForm()

    expect(await screen.findByRole('link', { name: 'Gamma Project' })).toBeInTheDocument()
  })

  it('rejects an invalid project form with accessible validation messages', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Projects />, { initialEntries: ['/projects'] })

    await user.click(screen.getByRole('button', { name: /new project/i }))
    await user.click(screen.getByRole('button', { name: 'Create project' }))

    expect(screen.getByText('Project name is required.')).toBeInTheDocument()
    expect(screen.getByText('Project description is required.')).toBeInTheDocument()
    expect(screen.getByText('Due date is required.')).toBeInTheDocument()
    expect(screen.getByText('Select at least one team member.')).toBeInTheDocument()
  })

  it('edits a project and updates the visible project name', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Projects />, { initialEntries: ['/projects'] })

    await user.click(screen.getByRole('button', { name: 'Edit Marketplace Refresh' }))
    const projectNameInput = screen.getByLabelText(/^Project name/)
    await user.clear(projectNameInput)
    await user.type(projectNameInput, 'Alpha Project Updated')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByRole('link', { name: 'Alpha Project Updated' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Marketplace Refresh' })).not.toBeInTheDocument()
  })

  it('requires confirmation before deleting a project and removes it after confirmation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Projects />, { initialEntries: ['/projects'] })

    await user.click(screen.getByRole('button', { name: 'Delete Marketplace Refresh' }))

    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Are you sure you want to delete Marketplace Refresh?',
    )
    expect(screen.getByRole('link', { name: 'Marketplace Refresh' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete project' }))

    expect(screen.queryByRole('link', { name: 'Marketplace Refresh' })).not.toBeInTheDocument()
  })
})
