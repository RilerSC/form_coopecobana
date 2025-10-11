import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  required?: boolean
  error?: string | undefined
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
  autoComplete?: string
  inputMode?: 'text' | 'numeric' | 'email' | 'tel'
  pattern?: string
}

/**
 * Componente FormField reutilizable para inputs del formulario
 * Incluye label, input, validación visual y mensaje de error
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    required = false, 
    error, 
    className,
    value,
    onChange,
    onBlur,
    disabled = false,
    autoComplete,
    inputMode,
    pattern,
    ...props 
  }, ref) => {
    const inputId = `field-${name}`
    const errorId = `error-${name}`
    
    return (
      <div className={clsx('space-y-1', className)}>
        {/* Label */}
        <label 
          htmlFor={inputId} 
          className="form-label"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="Campo obligatorio">
              *
            </span>
          )}
        </label>
        
        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          pattern={pattern}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            'form-input',
            {
              'border-red-300 focus:ring-red-500 focus:border-red-500': error,
              'opacity-50 cursor-not-allowed': disabled,
            }
          )}
          {...props}
        />
        
        {/* Mensaje de error */}
        {error && (
          <p 
            id={errorId}
            className="form-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

/**
 * Variante específica para números de asociado y cédula
 * Solo permite dígitos
 */
export const NumericField = forwardRef<HTMLInputElement, Omit<FormFieldProps, 'type'>>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Solo permitir dígitos
      const numericValue = e.target.value.replace(/\D/g, '')
      
      // Crear evento sintético con el valor limpio
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericValue
        }
      }
      
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }

    return (
      <FormField
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        onChange={handleChange}
        {...props}
      />
    )
  }
)

NumericField.displayName = 'NumericField'