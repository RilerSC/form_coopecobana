import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  children: React.ReactNode
}

/**
 * Componente Button reutilizable con múltiples variantes y estados
 * Incluye estado loading, diferentes tamaños y estilos
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    fullWidth = false,
    disabled,
    className,
    children,
    type = 'button',
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={clsx(
          // Clases base
          'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          
          // Variantes
          {
            // Primary
            'btn-primary': variant === 'primary',
            
            // Secondary
            'btn-secondary': variant === 'secondary',
            
            // Danger
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed': variant === 'danger',
          },
          
          // Tamaños
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          
          // Ancho completo
          {
            'w-full': fullWidth,
          },
          
          // Estados
          {
            'cursor-not-allowed opacity-50': isDisabled,
          },
          
          className
        )}
        {...props}
      >
        {/* Spinner de loading */}
        {loading && (
          <svg 
            className="loading-spinner mr-2" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
              opacity="0.25"
            />
            <path 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              opacity="0.75"
            />
          </svg>
        )}
        
        {/* Contenido del botón */}
        <span>
          {loading && loadingText ? loadingText : children}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'

/**
 * Botón específico para envío de formularios
 */
export const SubmitButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'type'>>(
  ({ loading = false, loadingText = 'Enviando...', children = 'Enviar formulario', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        loadingText={loadingText}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

SubmitButton.displayName = 'SubmitButton'

/**
 * Botón de acción secundaria (cancelar, resetear, etc.)
 */
export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="secondary"
        {...props}
      />
    )
  }
)

SecondaryButton.displayName = 'SecondaryButton'

/**
 * Botón de peligro (eliminar, cancelar envío, etc.)
 */
export const DangerButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="danger"
        {...props}
      />
    )
  }
)

DangerButton.displayName = 'DangerButton'