import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../constants/storage'
import { Settings } from '../pages/Settings'
import { renderWithProviders } from './test-utils'

describe('settings preferences', () => {
  it('changes the application theme and restores it from storage', async () => {
    const user = userEvent.setup()
    const firstRender = renderWithProviders(<Settings />, { initialEntries: ['/settings'] })

    await user.click(screen.getByRole('radio', { name: /^Dark/ }))

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBe('"dark"')

    firstRender.unmount()
    renderWithProviders(<Settings />, { initialEntries: ['/settings'] })

    expect(screen.getByRole('radio', { name: /^Dark/ })).toBeChecked()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('changes and persists notification preferences', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Settings />, { initialEntries: ['/settings'] })
    const taskDeadlineSwitch = screen.getByRole('switch', {
      name: 'Task deadline notifications',
    })

    expect(taskDeadlineSwitch).toBeChecked()
    await user.click(taskDeadlineSwitch)

    expect(taskDeadlineSwitch).not.toBeChecked()
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEYS.notifications) ?? '{}'),
    ).toMatchObject({
      taskDeadlines: false,
      projectUpdates: true,
      activityUpdates: true,
    })
  })
})
