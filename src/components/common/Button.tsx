import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant
  isLoading?: boolean
  children: ReactNode
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'btn-primary btn-teamflow-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  outline: 'btn-outline-primary',
  ghost: 'btn-teamflow-ghost',
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  const classNames = ['btn', variantClassNames[variant], className].filter(Boolean).join(' ')

  return (
    <button
      {...props}
      type={type}
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? <Spinner size="small" label="Loading" /> : null}
      <span className={isLoading ? 'ms-2' : undefined}>{children}</span>
    </button>
  )
}
