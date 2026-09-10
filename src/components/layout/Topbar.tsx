import { mobileNavigationId } from './MobileNavigation'
import type { LayoutUser } from './AppLayout'

export interface TopbarProps {
  title: string
  eyebrow?: string
  notificationCount?: number
  currentUser: LayoutUser
  mobileNavigationOpen: boolean
  onMobileNavigationToggle: () => void
  onLogout: () => void
}

export function Topbar({
  title,
  eyebrow = 'Workspace',
  notificationCount = 0,
  currentUser,
  mobileNavigationOpen,
  onMobileNavigationToggle,
  onLogout,
}: TopbarProps) {
  const notificationLabel = notificationCount
    ? `Notifications, ${notificationCount} unread`
    : 'Notifications'

  return (
    <header className="topbar">
      <div className="container-fluid topbar__inner">
        <button
          type="button"
          className="btn btn-icon topbar__menu-toggle d-md-none"
          aria-label={mobileNavigationOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls={mobileNavigationId}
          aria-expanded={mobileNavigationOpen}
          onClick={onMobileNavigationToggle}
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="topbar__context">
          <p className="topbar__eyebrow">{eyebrow}</p>
          <p className="topbar__title">{title}</p>
        </div>

        <div className="topbar__actions">
          <button
            type="button"
            className="btn btn-icon topbar__notification"
            aria-label={notificationLabel}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
            {notificationCount > 0 ? (
              <span className="topbar__notification-count" aria-hidden="true">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            ) : null}
          </button>

          <div className="topbar__profile">
            <span className="layout-avatar" aria-hidden="true">
              {currentUser.initials}
            </span>
            <span className="topbar__profile-copy d-none d-sm-flex">
              <strong>{currentUser.name}</strong>
              <span>{currentUser.email}</span>
            </span>
            <button
              type="button"
              className="topbar__logout btn btn-sm btn-outline-secondary"
              onClick={onLogout}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
