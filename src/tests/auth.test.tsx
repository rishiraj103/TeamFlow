import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DEMO_CREDENTIALS, DEMO_USER } from '../constants/auth'
import { AUTH_STORAGE_KEY } from '../constants/auth'
import { renderAppAt } from './test-utils'

describe('authentication workflows', () => {
  it('logs in with the demo credentials and persists only the user state', async () => {
    const user = userEvent.setup()
    renderAppAt('/login')

    await user.type(screen.getByLabelText(/^Email/), DEMO_CREDENTIALS.email)
    await user.type(screen.getByLabelText(/^Password/), DEMO_CREDENTIALS.password)
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) ?? '{}')).toEqual(DEMO_USER)
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).not.toContain(DEMO_CREDENTIALS.password)
  })

  it('shows an error for invalid credentials', async () => {
    const user = userEvent.setup()
    renderAppAt('/login')

    await user.type(screen.getByLabelText(/^Email/), DEMO_CREDENTIALS.email)
    await user.type(screen.getByLabelText(/^Password/), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.')
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('validates required login fields before attempting authentication', async () => {
    const user = userEvent.setup()
    renderAppAt('/login')

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
  })

  it('redirects unauthenticated users and logs authenticated users out', async () => {
    const user = userEvent.setup()
    const unauthenticatedRender = renderAppAt('/dashboard')

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Sign in to TeamFlow' }),
    ).toBeInTheDocument()

    unauthenticatedRender.unmount()
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER))
    renderAppAt('/dashboard')
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Sign out' })[0])

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Sign in to TeamFlow' }),
    ).toBeInTheDocument()
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })
})
