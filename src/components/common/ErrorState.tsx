import { useId, type ReactNode } from 'react'

export interface ErrorStateProps {
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function ErrorState({ title, description, action, className }: ErrorStateProps) {
  const titleId = useId()
  const classNames = ['page-state', 'page-state--error', className].filter(Boolean).join(' ')

  return (
    <section className={classNames} role="alert" aria-labelledby={titleId}>
      <div className="page-state__icon" aria-hidden="true">
        !
      </div>
      <h2 id={titleId} className="page-state__title">
        {title}
      </h2>
      <p className="page-state__message">{description}</p>
      {action ? <div className="page-state__action">{action}</div> : null}
    </section>
  )
}
