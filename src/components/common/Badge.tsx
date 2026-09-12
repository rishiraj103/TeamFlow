import type { ReactNode } from 'react'

export type BadgeVariant =
  'active' | 'completed' | 'archived' | 'todo' | 'in-progress' | 'low' | 'medium' | 'high'

export interface BadgeProps {
  variant: BadgeVariant
  children?: ReactNode
  className?: string
}

const variantClassNames: Record<BadgeVariant, string> = {
  active: 'status-badge--active',
  completed: 'status-badge--completed',
  archived: 'status-badge--archived',
  todo: 'status-badge--todo',
  'in-progress': 'status-badge--in-progress',
  low: 'priority-badge priority-badge--low',
  medium: 'priority-badge priority-badge--medium',
  high: 'priority-badge priority-badge--high',
}

const variantLabels: Record<BadgeVariant, string> = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
  todo: 'To do',
  'in-progress': 'In progress',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function Badge({ variant, children, className }: BadgeProps) {
  const classNames = ['status-badge', variantClassNames[variant], className]
    .filter(Boolean)
    .join(' ')

  return <span className={classNames}>{children ?? variantLabels[variant]}</span>
}
