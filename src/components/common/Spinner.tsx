import type { HTMLAttributes } from 'react'

export type SpinnerSize = 'small' | 'medium' | 'large'

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'aria-label'> {
  size?: SpinnerSize
  label?: string
}

const sizeClassNames: Record<SpinnerSize, string> = {
  small: 'spinner-border-sm',
  medium: '',
  large: 'spinner-border-lg',
}

export function Spinner({ size = 'medium', label = 'Loading', className, ...props }: SpinnerProps) {
  const classNames = ['spinner-border', sizeClassNames[size], className].filter(Boolean).join(' ')

  return (
    <span
      {...props}
      className={classNames}
      role={label ? 'status' : 'presentation'}
      aria-hidden={label ? undefined : true}
    >
      {label ? <span className="visually-hidden">{label}</span> : null}
    </span>
  )
}
