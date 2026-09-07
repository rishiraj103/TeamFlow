import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { MobileNavigation } from './MobileNavigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export interface LayoutUser {
  name: string
  email: string
  role: string
  initials: string
}

export interface AppLayoutProps {
  pageTitle: string
  pageEyebrow?: string
  currentUser?: LayoutUser
  notificationCount?: number
}

const defaultUser: LayoutUser = {
  name: 'Alex Morgan',
  email: 'alex@teamflow.app',
  role: 'Product designer',
  initials: 'AM',
}

export function AppLayout({
  pageTitle,
  pageEyebrow,
  currentUser = defaultUser,
  notificationCount = 0,
}: AppLayoutProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} />

      <div className="app-layout__main">
        <Topbar
          title={pageTitle}
          eyebrow={pageEyebrow}
          notificationCount={notificationCount}
          currentUser={currentUser}
          mobileNavigationOpen={mobileNavigationOpen}
          onMobileNavigationToggle={() => setMobileNavigationOpen((isOpen) => !isOpen)}
        />

        <main className="app-layout__content">
          <div className="container-fluid app-layout__container">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNavigation
        open={mobileNavigationOpen}
        currentUser={currentUser}
        onClose={() => setMobileNavigationOpen(false)}
      />
    </div>
  )
}
