import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, within } from '@testing-library/react'
import { fixtureProjects, fixtureTasks } from './fixtures'
import { Tasks } from '../pages/Tasks'
import { DEFAULT_TASK_FILTERS, filterTasks } from '../utils/taskFilters'
import { filterProjects } from '../utils/projectFilters'
import type { TaskFilterState } from '../types'
import { renderWithProviders } from './test-utils'

function taskFilters(overrides: Partial<TaskFilterState> = {}): TaskFilterState {
  return { ...DEFAULT_TASK_FILTERS, ...overrides }
}

describe('search, filtering, and sorting utilities', () => {
  it('searches task titles, descriptions, and project metadata case-insensitively', () => {
    expect(filterTasks(fixtureTasks, taskFilters({ search: 'RELEASE NOTES' }))).toEqual([
      fixtureTasks[0],
    ])
    expect(filterTasks(fixtureTasks, taskFilters({ search: 'beta onboarding' }))).toEqual([
      fixtureTasks[1],
    ])
    expect(filterProjects(fixtureProjects, 'ARCHIVED INTERNAL', 'all')).toEqual([
      fixtureProjects[1],
    ])
  })

  it('filters tasks by status', () => {
    expect(filterTasks(fixtureTasks, taskFilters({ status: 'in-progress' }))).toEqual([
      fixtureTasks[1],
    ])
  })

  it('filters tasks by priority', () => {
    expect(filterTasks(fixtureTasks, taskFilters({ priority: 'high' }))).toEqual([fixtureTasks[0]])
  })

  it('combines search, status, priority, project, and assignee filters', () => {
    expect(
      filterTasks(
        fixtureTasks,
        taskFilters({
          search: 'release',
          status: 'todo',
          priority: 'high',
          projectId: 'project-one',
          assigneeId: 'user-amelia-chen',
        }),
      ),
    ).toEqual([fixtureTasks[0]])
  })

  it('returns all tasks in the default reset state in due-date order', () => {
    expect(filterTasks(fixtureTasks, DEFAULT_TASK_FILTERS).map((task) => task.id)).toEqual([
      'task-one',
      'task-two',
      'task-three',
    ])
  })

  it('resets rendered task filters and restores the full task list', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tasks />, { initialEntries: ['/tasks'] })

    await user.type(screen.getByRole('searchbox', { name: 'Search tasks' }), 'does-not-exist')
    expect(screen.getByText('No tasks match your current filters.')).toBeInTheDocument()

    await user.click(
      within(screen.getByRole('region', { name: 'Task filters' })).getByRole('button', {
        name: 'Reset Filters',
      }),
    )

    expect(
      screen.getByRole('heading', { name: 'Polish marketplace search filters' }),
    ).toBeInTheDocument()
  })
})
