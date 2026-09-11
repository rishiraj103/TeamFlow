import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../constants/storage'
import { projects } from '../data/projects'
import { tasks } from '../data/tasks'
import { Dashboard } from '../pages/Dashboard'
import { renderWithProviders } from './test-utils'

function seedDashboardState() {
  window.localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
  window.localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks.slice(0, 10)))
  window.localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify([]))
}

function expectStatValue(label: string, value: number) {
  const card = screen.getByRole('heading', { name: label }).closest('section')

  expect(card).not.toBeNull()
  expect(within(card!).getByText(String(value))).toBeInTheDocument()
}

describe('dashboard calculations', () => {
  it('displays statistics calculated from the stored workspace state', () => {
    seedDashboardState()
    renderWithProviders(<Dashboard />, { initialEntries: ['/dashboard'] })

    expectStatValue('Total Projects', 5)
    expectStatValue('Active Projects', 3)
    expectStatValue('Total Tasks', 10)
    expectStatValue('Completed Tasks', 4)
    expectStatValue('Team Members', 6)
  })

  it('handles zero projects, tasks, activity, and deadlines without broken values', () => {
    window.localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify([]))
    window.localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify([]))
    window.localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify([]))
    renderWithProviders(<Dashboard />, { initialEntries: ['/dashboard'] })

    expectStatValue('Total Projects', 0)
    expectStatValue('Active Projects', 0)
    expectStatValue('Total Tasks', 0)
    expectStatValue('Completed Tasks', 0)
    expect(screen.getByText('No projects yet.')).toBeInTheDocument()
    expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
    expect(screen.getByText('No activity yet.')).toBeInTheDocument()
    expect(screen.getByText('No upcoming deadlines.')).toBeInTheDocument()
    expect(screen.queryByText(/NaN|Infinity|undefined/)).not.toBeInTheDocument()
  })
})
