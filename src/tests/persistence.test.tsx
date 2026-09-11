import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '../constants/storage'
import { Projects } from '../pages/Projects'
import { Tasks } from '../pages/Tasks'
import { renderWithProviders } from './test-utils'
import { fixtureProjects, fixtureTasks } from './fixtures'

describe('application persistence', () => {
  it('loads saved projects and tasks instead of reseeding them', () => {
    window.localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(fixtureProjects))
    window.localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(fixtureTasks))

    const projectsRender = renderWithProviders(<Projects />, { initialEntries: ['/projects'] })
    expect(screen.getByRole('link', { name: 'Alpha Project' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Marketplace Refresh' })).not.toBeInTheDocument()

    projectsRender.unmount()
    renderWithProviders(<Tasks />, { initialEntries: ['/tasks'] })
    expect(screen.getByRole('heading', { name: 'Prepare release notes' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Polish marketplace search filters' }),
    ).not.toBeInTheDocument()
  })

  it('falls back to seed data and shows an intentional error for malformed storage', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    window.localStorage.setItem(STORAGE_KEYS.tasks, '{not-valid-json')
    renderWithProviders(<Tasks />, { initialEntries: ['/tasks'] })

    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Polish marketplace search filters' }),
    ).toBeInTheDocument()
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('malformed stored data'),
      expect.any(SyntaxError),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('malformed')
  })
})
