import { useState, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import { validarArchivos } from '../lib/validations'
import { FORM_CONSTANTS } from '../types'

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  currentFiles?: File[]
  error?: string
  disabled?: boolean
  maxFiles?: number
}

/**
 * Componente FileUpload con drag & drop y validación
 * Soporta múltiples archivos con preview y eliminación individual
 */
export function FileUpload({ 
  onFilesChange, 
  currentFiles = [], 
  error, 
  disabled = false
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [validationError, setValidationError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obtener ícono según tipo de archivo
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('word') || type.includes('officedocument')) return '📝'
    return '📎'
  }

  // Procesar archivos seleccionados
  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const allFiles = [...currentFiles, ...fileArray]

    // Validar archivos
    const validation = validarArchivos(allFiles)
    
    if (!validation.esValido) {
      setValidationError(validation.errores.join(', '))
      return
    }

    setValidationError(undefined)
    onFilesChange(allFiles)
  }, [currentFiles, onFilesChange])

  // Manejar selección de archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Limpiar input para permitir seleccionar el mismo archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Manejar drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }

  // Eliminar archivo específico
  const removeFile = (indexToRemove: number) => {
    const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove)
    onFilesChange(updatedFiles)
    setValidationError(undefined)
  }

  // Abrir selector de archivos
  const openFileSelector = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Calcular tamaño total
  const totalSize = currentFiles.reduce((sum, file) => sum + file.size, 0)
  const totalSizeMB = Math.round((totalSize / (1024 * 1024)) * 100) / 100

  const displayError = error || validationError

  return (
    <div className="space-y-4">
      {/* Área de drop */}
      <div
        className={clsx(
          'file-dropzone',
          {
            'dragover border-primary-500 bg-primary-50': isDragOver,
            'opacity-50 cursor-not-allowed': disabled,
            'border-red-300 bg-red-50': displayError,
          }
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileSelector}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Área para subir archivos"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            openFileSelector()
          }
        }}
      >
        <div className="space-y-3">
          {/* Ícono */}
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          {/* Texto */}
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {isDragOver ? 'Suelte los archivos aquí' : 'Haga clic para subir archivos'}
            </p>
            <p className="text-gray-500 mt-1">
              o arrastre y suelte los archivos
            </p>
          </div>
          
          {/* Información de archivos */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Tipos permitidos: PDF, JPG, PNG</p>
            <p>Máximo: {FORM_CONSTANTS.MAX_FILE_SIZE_MB}MB por archivo, {FORM_CONSTANTS.MAX_TOTAL_SIZE_MB}MB total</p>
          </div>
        </div>
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Lista de archivos seleccionados */}
      {currentFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Archivos seleccionados ({currentFiles.length})
            </h4>
            <span className="text-sm text-gray-500">
              Total: {totalSizeMB}MB de {FORM_CONSTANTS.MAX_TOTAL_SIZE_MB}MB
            </span>
          </div>
          
          <div className="space-y-2">
            {currentFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-lg" role="img" aria-label="Tipo de archivo">
                    {getFileIcon(file.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="ml-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Eliminar ${file.name}`}
                  disabled={disabled}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {displayError && (
        <p className="form-error" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}