'use server'

import { redirect } from 'next/navigation'
import { ServerFormularioSchema, validarArchivos, validarFechaLimite } from '../lib/validations'
import { enviarCorreoAdministradores, enviarCorreoConfirmacion, enviarNotificacionError } from '../lib/email'
import type { FormularioRespuesta } from '../types'

/**
 * Server Action principal para procesar el formulario de representación
 * Maneja validación, envío de correos y redirección
 */
export async function procesarFormulario(formData: FormData): Promise<FormularioRespuesta> {
  try {
    // 1. Verificar que el formulario esté abierto
    if (!validarFechaLimite()) {
      redirect('/cerrado')
    }

    // 2. Extraer archivos del FormData
    const archivos: File[] = []
    const archivosEntries = formData.getAll('archivos') as File[]
    
    archivosEntries.forEach(archivo => {
      if (archivo instanceof File && archivo.size > 0) {
        archivos.push(archivo)
      }
    })

    // 3. Extraer datos del formulario
    const datosFormulario = {
      numeroAsociado: formData.get('numeroAsociado') as string,
      cedula: formData.get('cedula') as string,
      nombreCompleto: formData.get('nombreCompleto') as string,
      correoElectronico: formData.get('correoElectronico') as string,
      correoElectronicoSecundario: formData.get('correoElectronicoSecundario') as string || undefined,
      telefonoCelular: formData.get('telefonoCelular') as string,
      participaraAsamblea: formData.get('participaraAsamblea') as 'si' | 'no',
      representaraOtros: formData.get('representaraOtros') as 'si' | 'no' | undefined,
      archivos
    }

    // 4. Validar datos del formulario
    const resultadoValidacion = ServerFormularioSchema.safeParse(datosFormulario)
    
    if (!resultadoValidacion.success) {
      const errores = resultadoValidacion.error.errors
        .map(error => `${error.path.join('.')}: ${error.message}`)
        .join(', ')
      
      return {
        success: false,
        message: 'Error de validación',
        error: errores
      }
    }

    // 5. Validar archivos
    const validacionArchivos = validarArchivos(archivos)
    
    if (!validacionArchivos.esValido) {
      return {
        success: false,
        message: 'Error en archivos adjuntos',
        error: validacionArchivos.errores.join(', ')
      }
    }

    const datosValidados = resultadoValidacion.data

    // 6. Intentar envío de correos
    let envioExitoso = false
    let erroresEnvio = []
    
    try {
      // Enviar a administradores primero
      await enviarCorreoAdministradores(datosValidados)
      console.log('✓ Correo a administradores enviado exitosamente')
      envioExitoso = true
    } catch (errorAdmin) {
      console.error('✗ Error enviando correo a administradores:', errorAdmin)
      erroresEnvio.push('Error al enviar correo a administradores')
    }
    
    try {
      // Enviar confirmación al asociado
      await enviarCorreoConfirmacion(datosValidados)
      console.log('✓ Correo de confirmación enviado exitosamente')
    } catch (errorConfirmacion) {
      console.error('✗ Error enviando confirmación:', errorConfirmacion)
      erroresEnvio.push('Error al enviar confirmación')
    }
    
    // Si al menos un correo se envió exitosamente, considerarlo éxito
    if (envioExitoso) {
      console.log('✓ Formulario procesado exitosamente')
      
      return {
        success: true,
        message: 'Formulario enviado exitosamente',
        redirect: '/enviado'
      }
    } else {
      // Solo si ambos fallan, reportar error
      const mensajeError = erroresEnvio.join(', ')
      
      try {
        await enviarNotificacionError(datosValidados, mensajeError)
      } catch (errorNotificacion) {
        console.error('Error enviando notificación de error:', errorNotificacion)
      }
      
      return {
        success: false,
        message: 'Error al enviar el formulario',
        error: 'No se pudo enviar el correo. El equipo técnico ha sido notificado.',
        details: mensajeError
      }
    }

  } catch (error) {
    // Error general del sistema
    console.error('Error procesando formulario:', error)
    
    return {
      success: false,
      message: 'Error del sistema',
      error: 'Ocurrió un error inesperado. Intente nuevamente en unos minutos.',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Server Action para verificar si el formulario está abierto
 */
export async function verificarFormularioAbierto(): Promise<boolean> {
  return validarFechaLimite()
}

/**
 * Server Action para obtener tiempo restante hasta el cierre
 */
export async function obtenerTiempoRestante(): Promise<{
  estaAbierto: boolean
  tiempoRestante?: string
  fechaCierre: string
}> {
  const fechaCierre = new Date(process.env.FORM_CLOSE_DATE || '2025-11-06T01:00:00-06:00')
  const ahora = new Date()
  const estaAbierto = ahora < fechaCierre

  let tiempoRestante: string | undefined

  if (estaAbierto) {
    const diferencia = fechaCierre.getTime() - ahora.getTime()
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))

    if (dias > 0) {
      tiempoRestante = `${dias} día${dias > 1 ? 's' : ''} y ${horas} hora${horas > 1 ? 's' : ''}`
    } else if (horas > 0) {
      tiempoRestante = `${horas} hora${horas > 1 ? 's' : ''} y ${minutos} minuto${minutos > 1 ? 's' : ''}`
    } else {
      tiempoRestante = `${minutos} minuto${minutos > 1 ? 's' : ''}`
    }
  }

  const resultado: { estaAbierto: boolean; tiempoRestante?: string; fechaCierre: string } = {
    estaAbierto,
    fechaCierre: fechaCierre.toLocaleString('es-CR', { 
      timeZone: 'America/Costa_Rica',
      dateStyle: 'full',
      timeStyle: 'short'
    })
  }
  
  if (tiempoRestante) {
    resultado.tiempoRestante = tiempoRestante
  }
  
  return resultado
}