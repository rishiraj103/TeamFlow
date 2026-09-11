import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ActivityProvider } from '../context/ActivityContext'
import { AuthProvider } from '../context/AuthContext'
import { NotificationPreferencesProvider } from '../context/NotificationPreferencesContext'
import { ProjectProvider } from '../context/ProjectContext'
import { TaskProvider } from '../context/TaskContext'
import { ThemeProvider } from '../context/ThemeContext'

export interface TestProvidersProps {
  children: ReactNode
  initialEntries?: string[]
}

export function TestProviders({ children, initialEntries = ['/'] }: TestProvidersProps) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <ActivityProvider>
          <ProjectProvider>
            <TaskProvider>
              <ThemeProvider>
                <NotificationPreferencesProvider>{children}</NotificationPreferencesProvider>
              </ThemeProvider>
            </TaskProvider>
          </ProjectProvider>
        </ActivityProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}
