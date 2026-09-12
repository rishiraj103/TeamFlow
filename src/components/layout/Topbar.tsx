import { useTheme } from '../../context/useTheme'
import { mobileNavigationId } from './MobileNavigation'
import { NotificationCenter } from './NotificationCenter'

export interface TopbarProps {
  title: string
  mobileNavigationOpen: boolean
  onMobileNavigationToggle: () => void
}

export function Topbar({ title, mobileNavigationOpen, onMobileNavigationToggle }: TopbarProps) {
  const { currentTheme, toggleTheme } = useTheme()
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light'

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
          <p className="topbar__title">{title}</p>
        </div>

        <div className="topbar__actions">
          <NotificationCenter />

          <button
            type="button"
            className="btn btn-icon topbar__theme-toggle"
            aria-label={`Switch to ${nextTheme} mode`}
            onClick={toggleTheme}
          >
            {currentTheme === 'light' ? (
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
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z" />
              </svg>
            ) : (
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
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
