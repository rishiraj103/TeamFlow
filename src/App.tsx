import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Analytics } from './pages/Analytics'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { ProjectDetails } from './pages/ProjectDetails'
import { Projects } from './pages/Projects'
import { Settings } from './pages/Settings'
import { Tasks } from './pages/Tasks'
import { Team } from './pages/Team'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <AppLayout
              pageTitle="TeamFlow workspace"
              pageEyebrow="Application"
              notificationCount={3}
            />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="team" element={<Team />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
