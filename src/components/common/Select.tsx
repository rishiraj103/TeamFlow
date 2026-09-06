import { useId, type ChangeEventHandler, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'name' | 'value' | 'onChange' | 'children' | 'aria-describedby'
> {
  label: string
  name: string
  value: string
  onChange: ChangeEventHandler<HTMLSelectElement>
  options: readonly SelectOption[]
  placeholder?: string
  error?: string
  helperText?: string
  id?: string
}

export function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error,
  helperText,
  id,
  className,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? `${name}-${generatedId.replaceAll(':', '')}`
  const helperId = `${selectId}-helper`
  const errorId = `${selectId}-error`
  const describedBy = [helperText ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')
  const selectClassNames = ['form-select', error ? 'is-invalid' : null, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="field-group">
      <label htmlFor={selectId} className="form-label">
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
      <select
        {...props}
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClassNames}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
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
