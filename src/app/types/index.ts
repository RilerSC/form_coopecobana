// ============================================
// TIPOS Y INTERFACES PARA FORM_COOPECOBANA
// ============================================

/**
 * Datos del formulario de representación
 */
export interface FormularioData {
  numeroAsociado: string
  cedula: string
  nombreCompleto: string
  correoElectronico: string
  correoElectronicoSecundario?: string | undefined // Opcional
  telefonoCelular?: string | undefined // Opcional
  participaraAsamblea: 'si' | 'no'
  representaraOtros?: 'si' | 'no' | undefined // Solo si participa = 'si'
  archivos: File[]
  fechaEnvio?: Date
}

/**
 * Tipo para el estado del formulario
 */
export type FormularioEstado = 'idle' | 'loading' | 'success' | 'error'

/**
 * Respuesta del servidor al enviar el formulario
 */
export interface FormularioRespuesta {
  success: boolean
  message: string
  error?: string
  details?: string
  redirect?: string
}

/**
 * Información de archivo adjunto
 */
export interface ArchivoAdjunto {
  file: File
  size: number
  type: string
  name: string
  isValid: boolean
  errorMessage?: string
}

/**
 * Validación de archivos
 */
export interface ValidacionArchivos {
  archivosValidos: ArchivoAdjunto[]
  totalSize: number
  errors: string[]
  isValid: boolean
}

/**
 * Configuración de límites de archivos
 */
export interface LimitesArchivos {
  maxFileSize: number // En bytes
  maxTotalSize: number // En bytes
  allowedTypes: string[]
  allowedExtensions: string[]
}

/**
 * Datos para el correo electrónico
 */
export interface DatosCorreo {
  para: string[]
  asunto: string
  contenido: string
  adjuntos: ArchivoAdjunto[]
  remitente: {
    nombre: string
    email: string
  }
}

/**
 * Configuración SMTP
 */
export interface ConfiguracionSMTP {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

/**
 * Información de fecha y horario
 */
export interface FechaLimite {
  fechaCierre: Date
  zonaHoraria: string
  estaAbierto: boolean
  tiempoRestante?: string
}

/**
 * Props para componentes de formulario
 */
export interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
}

export interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  currentFiles?: File[]
  error?: string
}

export interface RadioGroupProps {
  label: string
  name: string
  options: Array<{
    value: string
    label: string
  }>
  error?: string
  onChange: (value: string) => void
  value?: string
}

/**
 * Estados de la aplicación
 */
export type AppState = {
  formulario: FormularioData
  estado: FormularioEstado
  errores: Record<string, string>
  archivos: ArchivoAdjunto[]
  fechaLimite: FechaLimite
}

/**
 * Tipos para validaciones con Zod
 */
export interface ValidationResult {
  success: boolean
  data?: FormularioData
  errors?: Record<string, string[]>
}

/**
 * Constantes de la aplicación
 */
export const FORM_CONSTANTS = {
  MAX_FILE_SIZE_MB: 10,
  MAX_TOTAL_SIZE_MB: 20,
  ALLOWED_FILE_TYPES: [
    'application/pdf', 
    'image/jpeg', 
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.docx'],
  FECHA_CIERRE: '2025-11-06T01:00:00-06:00',
  ZONA_HORARIA: 'America/Costa_Rica'
} as const

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Ingrese un correo electrónico válido',
  INVALID_CEDULA: 'La cédula debe contener solo números',
  INVALID_NUMERO_ASOCIADO: 'El número de asociado debe contener solo números',
  RESTRICTED_EMAIL_DOMAIN: 'No se permiten correos con dominio @bncr.fi.cr',
  FILE_TOO_LARGE: 'El archivo excede el tamaño máximo permitido',
  TOTAL_SIZE_EXCEEDED: 'El tamaño total de archivos excede el límite',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
  FORM_CLOSED: 'El formulario ya no está disponible',
  NETWORK_ERROR: 'Error de conexión. Intente nuevamente',
  SERVER_ERROR: 'Error del servidor. Intente más tarde'
} as const

/**
 * Mensajes de éxito
 */
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Formulario enviado exitosamente',
  EMAIL_SENT: 'Correo enviado correctamente',
  FILES_UPLOADED: 'Archivos adjuntados correctamente'
} as const