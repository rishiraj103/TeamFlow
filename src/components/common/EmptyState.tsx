import { useId, type ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  const titleId = useId()
  const classNames = ['empty-state', 'text-center', className].filter(Boolean).join(' ')

  return (
    <section className={classNames} aria-labelledby={titleId}>
      {icon ? (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h2 id={titleId} className="empty-state__title">
        {title}
      </h2>
      <p className="empty-state__description">{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </section>
  )
}
