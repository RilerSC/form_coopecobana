import { z } from 'zod'
import { ERROR_MESSAGES, FORM_CONSTANTS } from '../types'

/**
 * Schema de validación para el formulario de representación
 * Basado en las especificaciones del proyecto COOPECOBANA
 */

export const FormularioSchema = z.object({
  // Número de asociado - solo dígitos
  numeroAsociado: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .regex(/^\d+$/, ERROR_MESSAGES.INVALID_NUMERO_ASOCIADO)
    .transform(val => val.trim()),

  // Cédula - solo números, sin guiones ni espacios  
  cedula: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .regex(/^\d+$/, ERROR_MESSAGES.INVALID_CEDULA)
    .transform(val => val.replace(/\D/g, '')), // Remover no-dígitos

  // Nombre completo - mínimo 3 caracteres
  nombreCompleto: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .transform(val => val.trim()),

  // Correo electrónico - validación estricta
  correoElectronico: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .transform(val => val.toLowerCase().trim()),

  // Teléfono celular - opcional, solo dígitos
  telefonoCelular: z
    .string()
    .optional()
    .transform(val => val?.replace(/\D/g, '') || undefined),

  // Participará en asamblea - obligatorio
  participaraAsamblea: z
    .enum(['si', 'no'], {
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: 'Debe seleccionar una opción válida'
    }),

  // Representará a otros - condicional
  representaraOtros: z
    .enum(['si', 'no'])
    .optional(),

  // Archivos - validación de tipo y tamaño
  archivos: z
    .array(z.instanceof(File))
    .optional()
    .default([])
})

/**
 * Tipo inferido del schema
 */
export type FormularioInput = z.infer<typeof FormularioSchema>

/**
 * Validación específica para archivos
 */
export const validarArchivos = (archivos: File[]) => {
  const errores: string[] = []
  let tamaañoTotal = 0
  const archivosValidos: File[] = []

  // Verificar cada archivo
  archivos.forEach((archivo, index) => {
    const tamaño = archivo.size
    const tipo = archivo.type
    const extension = archivo.name.toLowerCase().split('.').pop()

    // Validar tamaño individual
    if (tamaño > FORM_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024) {
      errores.push(`Archivo ${index + 1}: ${ERROR_MESSAGES.FILE_TOO_LARGE} (máx. ${FORM_CONSTANTS.MAX_FILE_SIZE_MB}MB)`)
      return
    }

    // Validar tipo de archivo
    const tipoPermitido = FORM_CONSTANTS.ALLOWED_FILE_TYPES.includes(tipo as any)
    const extensionPermitida = extension && FORM_CONSTANTS.ALLOWED_EXTENSIONS.includes(`.${extension}` as any)
    
    if (!tipoPermitido && !extensionPermitida) {
      errores.push(`Archivo ${index + 1}: ${ERROR_MESSAGES.INVALID_FILE_TYPE}. Solo se permiten: PDF, JPG, PNG, DOCX`)
      return
    }

    tamaañoTotal += tamaño
    archivosValidos.push(archivo)
  })

  // Validar tamaño total
  if (tamaañoTotal > FORM_CONSTANTS.MAX_TOTAL_SIZE_MB * 1024 * 1024) {
    errores.push(`${ERROR_MESSAGES.TOTAL_SIZE_EXCEEDED} (máx. ${FORM_CONSTANTS.MAX_TOTAL_SIZE_MB}MB total)`)
  }

  return {
    esValido: errores.length === 0,
    errores,
    archivosValidos,
    tamaañoTotal,
    tamaañoTotalMB: Math.round((tamaañoTotal / (1024 * 1024)) * 100) / 100
  }
}

/**
 * Validación de fecha límite
 */
export const validarFechaLimite = (): boolean => {
  const ahora = new Date()
  const fechaCierre = new Date(FORM_CONSTANTS.FECHA_CIERRE)
  return ahora < fechaCierre
}

/**
 * Validación condicional para representación
 */
export const FormularioSchemaCompleto = FormularioSchema.refine(
  (data) => {
    // Si participa en la asamblea, debe indicar si representará a otros
    if (data.participaraAsamblea === 'si') {
      return data.representaraOtros !== undefined
    }
    return true
  },
  {
    message: 'Debe indicar si representará a otros asociados',
    path: ['representaraOtros']
  }
)

/**
 * Schema para validación en el servidor
 */
export const ServerFormularioSchema = FormularioSchema.extend({
  // En el servidor también validamos la fecha
  fechaEnvio: z.date().refine(
    () => validarFechaLimite(),
    {
      message: ERROR_MESSAGES.FORM_CLOSED
    }
  ).optional().default(() => new Date())
}).refine(
  (data) => {
    // Si participa en la asamblea, debe indicar si representará a otros
    if (data.participaraAsamblea === 'si') {
      return data.representaraOtros !== undefined
    }
    return true
  },
  {
    message: 'Debe indicar si representará a otros asociados',
    path: ['representaraOtros']
  }
)

/**
 * Utilidad para formatear errores de validación
 */
export const formatearErroresValidacion = (errores: z.ZodError) => {
  const erroresFormateados: Record<string, string> = {}
  
  errores.errors.forEach((error) => {
    const campo = error.path.join('.')
    erroresFormateados[campo] = error.message
  })
  
  return erroresFormateados
}

/**
 * Utilidad para validar un campo específico
 */
export const validarCampo = (campo: keyof FormularioInput, valor: any) => {
  try {
    const campoSchema = FormularioSchema.shape[campo]
    campoSchema.parse(valor)
    return { esValido: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        esValido: false, 
        error: error.errors[0]?.message || 'Error de validación' 
      }
    }
    return { esValido: false, error: 'Error desconocido' }
  }
}