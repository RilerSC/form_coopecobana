import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface DocumentDownloadProps {
  title: string
  description: string
  fileName: string
  downloadUrl: string
  icon?: 'pdf' | 'doc'
  variant?: 'primary' | 'secondary'
  className?: string
}

/**
 * Componente para la descarga de documentos oficiales
 */
export const DocumentDownload = forwardRef<HTMLDivElement, DocumentDownloadProps>(
  ({ 
    title, 
    description, 
    fileName, 
    downloadUrl, 
    icon = 'pdf', 
    variant = 'primary',
    className 
  }, ref) => {
    const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
      // PREVENCIÓN COMPLETA DE EVENTOS
      e.preventDefault()
      e.stopPropagation()
      
      // Acceso al evento nativo para stopImmediatePropagation
      const nativeEvent = e.nativeEvent
      if (nativeEvent && typeof nativeEvent.stopImmediatePropagation === 'function') {
        nativeEvent.stopImmediatePropagation()
      }
      
      // Marcar que este es un evento de descarga
      console.log('🔄 Iniciando descarga:', fileName)
      
      // Usar timeout para evitar conflictos con otros eventos
      setTimeout(() => {
        try {
          // Método principal: descarga directa
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = fileName
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          link.style.display = 'none'
          
          // Agregar al DOM, click y remover
          document.body.appendChild(link)
          link.click()
          
          // Cleanup después de un delay
          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link)
            }
          }, 100)
          
          console.log('✅ Descarga iniciada correctamente')
          
        } catch (error) {
          console.warn('⚠️ Error en descarga directa, usando fallback:', error)
          // Fallback: abrir en nueva ventana
          window.open(downloadUrl, '_blank', 'noopener,noreferrer')
        }
      }, 50) // Delay mínimo para evitar interferencias
      
      // Asegurar que el evento no se propague
      return false
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg border p-6 transition-colors duration-200',
          {
            'bg-coopecobana-50 border-coopecobana-200 hover:bg-coopecobana-100': variant === 'primary',
            'bg-cooperativa-50 border-cooperativa-200 hover:bg-cooperativa-100': variant === 'secondary',
          },
          className
        )}
      >
        <div className="flex items-start space-x-4">
          {/* Icono del documento */}
          <div className={clsx(
            'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
            {
              'bg-coopecobana-500 text-white': variant === 'primary',
              'bg-cooperativa-500 text-white': variant === 'secondary',
            }
          )}>
            {icon === 'pdf' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <h3 className={clsx(
              'text-lg font-semibold mb-2',
              {
                'text-coopecobana-900': variant === 'primary',
                'text-cooperativa-900': variant === 'secondary',
              }
            )}>
              {title}
            </h3>
            <p className={clsx(
              'text-sm mb-4',
              {
                'text-coopecobana-700': variant === 'primary',
                'text-cooperativa-700': variant === 'secondary',
              }
            )}>
              {description}
            </p>
            
            {/* Botón de descarga */}
            <button
              type="button"
              onClick={handleDownload}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              data-download-button="true"
              data-file-name={fileName}
              data-action="download"
              role="button"
              aria-label={`Descargar ${title}`}
              className={clsx(
                'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                {
                  'bg-coopecobana-600 text-white hover:bg-coopecobana-700 focus:ring-coopecobana-500': variant === 'primary',
                  'bg-cooperativa-600 text-white hover:bg-cooperativa-700 focus:ring-cooperativa-500': variant === 'secondary',
                }
              )}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar {icon === 'pdf' ? 'PDF' : 'Documento'}
            </button>
          </div>
        </div>
      </div>
    )
  }
)

DocumentDownload.displayName = 'DocumentDownload'

/**
 * Componente específico para la convocatoria
 */
export const ConvocatoriaDownload = () => {
  return (
    <DocumentDownload
      title="Convocatoria a Asamblea General"
      description="Descargue y revise la convocatoria oficial a la Asamblea General de COOPECOBANA. Este documento contiene toda la información importante sobre la agenda, fecha, hora y modalidad de participación."
      fileName="CONVOCATORIA.pdf"
      downloadUrl="/CONVOCATORIA.pdf"
      icon="pdf"
      variant="primary"
    />
  )
}

/**
 * Componente específico para la carta de representación
 */
export const CartaRepresentacionDownload = () => {
  return (
    <DocumentDownload
      title="Carta de Representación"
      description="Descargue este formulario, compléte todos los datos requeridos, fírmelo y súbalo nuevamente al sistema. Puede escanearlo como imagen (JPG, PNG) o como archivo PDF."
      fileName="CARTA_REPRESENTACION.docx"
      downloadUrl="/CARTA_REPRESENTACION.docx"
      icon="doc"
      variant="secondary"
    />
  )
}