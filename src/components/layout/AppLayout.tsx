import { Suspense, useState, type ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { DEMO_USER } from '../../constants/auth'
import { RouteLoadingFallback } from '../common/RouteLoadingFallback'
import { useAuth } from '../../context/useAuth'
import type { AuthUser } from '../../types/auth'
import { MobileNavigation } from './MobileNavigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export type LayoutUser = AuthUser

export interface AppLayoutProps {
  pageTitle: string
  pageEyebrow?: string
  notificationCount?: number
}

export function AppLayout({ pageTitle, pageEyebrow, notificationCount = 0 }: AppLayoutProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const { currentUser: authenticatedUser, logout } = useAuth()
  const navigate = useNavigate()
  const currentUser = authenticatedUser ?? DEMO_USER

  function handleLogout() {
    logout()
    setMobileNavigationOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />

      <div className="app-layout__main">
        <Topbar
          title={pageTitle}
          eyebrow={pageEyebrow}
          notificationCount={notificationCount}
          currentUser={currentUser}
          mobileNavigationOpen={mobileNavigationOpen}
          onMobileNavigationToggle={() => setMobileNavigationOpen((isOpen) => !isOpen)}
          onLogout={handleLogout}
        />

        <main className="app-layout__content">
          <div className="container-fluid app-layout__container">
            <RouteLoadingBoundary>
              <Outlet />
            </RouteLoadingBoundary>
          </div>
        </main>
      </div>

      <MobileNavigation
        open={mobileNavigationOpen}
        currentUser={currentUser}
        onClose={() => setMobileNavigationOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  )
}

function RouteLoadingBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>
}
