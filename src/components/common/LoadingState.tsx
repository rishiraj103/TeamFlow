import { Spinner } from './Spinner'

export interface LoadingStateProps {
  label: string
  className?: string
}

export function LoadingState({ label, className }: LoadingStateProps) {
  const classNames = ['page-state', 'page-state--loading', className].filter(Boolean).join(' ')

  return (
    <section className={classNames} aria-live="polite" aria-label={label}>
      <Spinner size="large" label={label} />
      <p className="page-state__message">{label}</p>
    </section>
  )
}
