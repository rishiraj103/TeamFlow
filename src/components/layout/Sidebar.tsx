import type { LayoutUser } from './AppLayout'
import { Link, NavLink } from 'react-router-dom'
import { ProjectIcon } from '../common/ProjectIcon'
import { navigationItems, type NavigationIcon } from './navigation'

interface NavigationIconProps {
  icon: NavigationIcon
}

export function NavigationIconGlyph({ icon }: NavigationIconProps) {
  const sharedProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (icon) {
    case 'dashboard':
      return (
        <svg {...sharedProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'projects':
      return (
        <svg {...sharedProps}>
          <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
          <path d="M3 10h18" />
        </svg>
      )
    case 'tasks':
      return (
        <svg {...sharedProps}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="m8 12 2.2 2.2L16 8.5" />
          <path d="M8 7h3" />
        </svg>
      )
    case 'team':
      return (
        <svg {...sharedProps}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <circle cx="17" cy="9" r="2.25" />
          <path d="M15.5 15.5a4.8 4.8 0 0 1 5 4.5" />
        </svg>
      )
    case 'analytics':
      return (
        <svg {...sharedProps}>
          <path d="M4 19V5" />
          <path d="M4 19h17" />
          <path d="m7 15 3-4 3 2 5-6" />
          <path d="M18 7h2v2" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.44 15a1.7 1.7 0 0 0-1.56-1.04H6v-2.4h.88A1.7 1.7 0 0 0 8.44 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.72 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.96 11H21v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
      )
  }
}

export interface SidebarProps {
  currentUser: LayoutUser
  onLogout: () => void
}

export function Sidebar({ currentUser, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Primary sidebar">
      <Link to="/" className="sidebar__brand" aria-label="TeamFlow home">
        <span className="sidebar__brand-mark" aria-hidden="true">
          <ProjectIcon size={23} />
        </span>
        <span className="sidebar__brand-name">TeamFlow</span>
      </Link>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        <ul className="sidebar__nav-list">
          {navigationItems.map((item) => (
            <li key={item.href} className="sidebar__nav-item">
              <NavLink
                to={item.href}
                className={({ isActive }) => `sidebar__nav-link${isActive ? ' is-active' : ''}`}
                end={item.href === '/dashboard'}
              >
                <span className="sidebar__nav-icon">
                  <NavigationIconGlyph icon={item.icon} />
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__user">
        <span className="layout-avatar" aria-hidden="true">
          {currentUser.initials}
        </span>
        <span className="sidebar__user-copy">
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role}</span>
        </span>
        <button
          type="button"
          className="sidebar__logout btn btn-sm btn-outline-secondary"
          onClick={onLogout}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
