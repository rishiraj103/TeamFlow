import { useId, type ReactNode } from 'react'

export interface CardProps {
  title: ReactNode
  subtitle?: ReactNode
  headerAction?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, subtitle, headerAction, children, className }: CardProps) {
  const titleId = useId()
  const classNames = ['card', 'tf-card', className].filter(Boolean).join(' ')

  return (
    <section className={classNames} aria-labelledby={titleId}>
      <header className="card-header tf-card__header d-flex align-items-start justify-content-between gap-3">
        <div className="tf-card__header-copy">
          <h2 id={titleId} className="tf-card__title">
            {title}
          </h2>
          {subtitle ? <p className="card-subtitle text-muted-strong mb-0">{subtitle}</p> : null}
        </div>
        {headerAction ? <div className="flex-shrink-0">{headerAction}</div> : null}
      </header>
      <div className="card-body tf-card__body">{children}</div>
    </section>
  )
}
