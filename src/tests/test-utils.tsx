import type { ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import App from '../App'
import { AUTH_STORAGE_KEY, DEMO_USER } from '../constants/auth'
import { TestProviders } from './test-providers'

interface ProviderOptions {
  initialEntries?: string[]
}

export function renderWithProviders(
  ui: ReactNode,
  options: ProviderOptions & Omit<RenderOptions, 'wrapper'> = {},
) {
  const { initialEntries, ...renderOptions } = options
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER))

  return render(<TestProviders initialEntries={initialEntries}>{ui}</TestProviders>, renderOptions)
}

export function renderAppAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}
