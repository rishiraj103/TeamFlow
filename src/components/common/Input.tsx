import { useId, type ChangeEventHandler, type InputHTMLAttributes } from 'react'

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name' | 'value' | 'onChange' | 'type' | 'aria-describedby'
> {
  label: string
  name: string
  type?: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  error?: string
  helperText?: string
  id?: string
}

export function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? `${name}-${generatedId.replaceAll(':', '')}`
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`
  const describedBy = [helperText ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')
  const inputClassNames = ['form-control', error ? 'is-invalid' : null, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="field-group">
      <label htmlFor={inputId} className="form-label">
        {label}
        {required ? (
          <>
            <span className="text-danger" aria-hidden="true">
              {' '}
              *
            </span>
            <span className="visually-hidden"> required</span>
          </>
        ) : null}
      </label>
      <input
        {...props}
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClassNames}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
      />
      {helperText ? (
        <div id={helperId} className="form-text field-helper">
          {helperText}
        </div>
      ) : null}
      {error ? (
        <div id={errorId} className="field-error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  )
}
