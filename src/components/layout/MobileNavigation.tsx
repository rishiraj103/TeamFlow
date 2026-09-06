import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { LayoutUser } from './AppLayout'
import { NavigationIconGlyph } from './Sidebar'
import { navigationItems } from './navigation'

export const mobileNavigationId = 'teamflow-mobile-navigation'

export interface MobileNavigationProps {
  open: boolean
  activeRoute: string
  currentUser: LayoutUser
  onClose: () => void
}

export function MobileNavigation({
  open,
  activeRoute,
  currentUser,
  onClose,
}: MobileNavigationProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    document.body.classList.add('mobile-navigation-open')
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('mobile-navigation-open')
      previouslyFocusedElement?.focus()
    }
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <>
      <button
        type="button"
        className="mobile-navigation__backdrop"
        aria-label="Close navigation menu"
        onClick={onClose}
      />
      <aside
        id={mobileNavigationId}
        className="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mobile-navigation__header">
          <Link to="/" className="sidebar__brand" aria-label="TeamFlow home">
            <span className="sidebar__brand-mark" aria-hidden="true">
              T
            </span>
            <span className="sidebar__brand-name">TeamFlow</span>
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="btn btn-icon mobile-navigation__close"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="mobile-navigation__nav" aria-label="Mobile primary navigation">
          <ul className="sidebar__nav-list">
            {navigationItems.map((item) => {
              const isActive =
                activeRoute === item.href || (activeRoute === '/' && item.href === '/dashboard')

              return (
                <li key={item.href} className="sidebar__nav-item">
                  <NavLink
                    to={item.href}
                    className={({ isActive: routeIsActive }) =>
                      `sidebar__nav-link${routeIsActive || isActive ? ' is-active' : ''}`
                    }
                    aria-current={isActive ? 'page' : undefined}
                    onClick={onClose}
                  >
                    <span className="sidebar__nav-icon">
                      <NavigationIconGlyph icon={item.icon} />
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
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
        </div>
      </aside>
    </>
  )
}
