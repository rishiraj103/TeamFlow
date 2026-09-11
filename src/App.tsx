import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute, PublicOnlyRoute } from './components/routing/AuthRoute'
import { AuthProvider } from './context/AuthContext'
import { ActivityProvider } from './context/ActivityContext'
import { ProjectProvider } from './context/ProjectContext'
import { TaskProvider } from './context/TaskContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationPreferencesProvider } from './context/NotificationPreferencesContext'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'

const Dashboard = lazy(() =>
  import('./pages/Dashboard').then(({ Dashboard: page }) => ({ default: page })),
)
const Projects = lazy(() =>
  import('./pages/Projects').then(({ Projects: page }) => ({ default: page })),
)
const ProjectDetails = lazy(() =>
  import('./pages/ProjectDetails').then(({ ProjectDetails: page }) => ({ default: page })),
)
const Tasks = lazy(() => import('./pages/Tasks').then(({ Tasks: page }) => ({ default: page })))
const Team = lazy(() => import('./pages/Team').then(({ Team: page }) => ({ default: page })))
const Analytics = lazy(() =>
  import('./pages/Analytics').then(({ Analytics: page }) => ({ default: page })),
)
const Settings = lazy(() =>
  import('./pages/Settings').then(({ Settings: page }) => ({ default: page })),
)

function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <ProjectProvider>
          <TaskProvider>
            <ThemeProvider>
              <NotificationPreferencesProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route element={<PublicOnlyRoute />}>
                      <Route path="/login" element={<Login />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                      <Route
                        element={
                          <AppLayout
                            pageTitle="TeamFlow workspace"
                            pageEyebrow="Application"
                            notificationCount={3}
                          />
                        }
                      >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:projectId" element={<ProjectDetails />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                      </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </NotificationPreferencesProvider>
            </ThemeProvider>
          </TaskProvider>
        </ProjectProvider>
      </ActivityProvider>
    </AuthProvider>
  )
}

export default App
