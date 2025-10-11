import { clsx } from 'clsx'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  label: string
  name: string
  options: RadioOption[]
  value?: string | undefined
  onChange: (value: string) => void
  error?: string | undefined
  required?: boolean
  disabled?: boolean
  className?: string | undefined
}

/**
 * Componente RadioGroup para opciones de selección única
 * Incluye estilos accesibles y manejo de errores
 */
export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className
}: RadioGroupProps) {
  const groupId = `radio-group-${name}`
  const errorId = `error-${name}`

  return (
    <fieldset 
      className={clsx('space-y-3', className)}
      aria-labelledby={groupId}
      aria-describedby={error ? errorId : undefined}
      disabled={disabled}
    >
      {/* Label del grupo */}
      <legend 
        id={groupId}
        className="form-label"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="Campo obligatorio">
            *
          </span>
        )}
      </legend>

      {/* Opciones */}
      <div className="space-y-2">
        {options.map((option) => {
          const optionId = `${name}-${option.value}`
          const isSelected = value === option.value
          
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={clsx(
                'flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors',
                {
                  'border-primary-500 bg-primary-50': isSelected,
                  'border-gray-300 bg-white hover:bg-gray-50': !isSelected && !disabled,
                  'border-red-300 bg-red-50': error && !isSelected,
                  'opacity-50 cursor-not-allowed': disabled,
                  'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2': !disabled
                }
              )}
            >
              {/* Radio button */}
              <input
                id={optionId}
                name={name}
                type="radio"
                value={option.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
                aria-describedby={option.description ? `${optionId}-desc` : undefined}
                className={clsx(
                  'mt-1 h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500',
                  {
                    'border-red-300': error,
                  }
                )}
              />
              
              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className={clsx(
                  'text-sm font-medium',
                  {
                    'text-primary-900': isSelected,
                    'text-gray-900': !isSelected,
                    'text-gray-500': disabled
                  }
                )}>
                  {option.label}
                </div>
                
                {option.description && (
                  <div 
                    id={`${optionId}-desc`}
                    className={clsx(
                      'text-xs mt-1',
                      {
                        'text-primary-700': isSelected,
                        'text-gray-500': !isSelected,
                        'text-gray-400': disabled
                      }
                    )}
                  >
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          )
        })}
      </div>

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
    </fieldset>
  )
}

/**
 * Variante compacta para opciones simples Sí/No
 */
export function BinaryRadioGroup({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className,
  yesLabel = 'Sí',
  noLabel = 'No'
}: Omit<RadioGroupProps, 'options'> & {
  yesLabel?: string
  noLabel?: string
}) {
  const options: RadioOption[] = [
    { value: 'si', label: yesLabel },
    { value: 'no', label: noLabel }
  ]

  return (
    <RadioGroup
      label={label}
      name={name}
      options={options}
      value={value}
      onChange={onChange}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
    />
  )
}