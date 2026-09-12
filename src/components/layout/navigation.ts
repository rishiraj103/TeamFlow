export type NavigationIcon = 'dashboard' | 'projects' | 'tasks' | 'team' | 'analytics' | 'settings'

export interface NavigationItem {
  label: string
  href: string
  icon: NavigationIcon
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Projects', href: '/projects', icon: 'projects' },
  { label: 'Tasks', href: '/tasks', icon: 'tasks' },
  { label: 'Team', href: '/team', icon: 'team' },
  { label: 'Analytics', href: '/analytics', icon: 'analytics' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
]
