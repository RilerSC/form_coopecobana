import nodemailer from 'nodemailer'
import type { FormularioData, ConfiguracionSMTP } from '../types'

/**
 * Configuración del transportador SMTP para Gmail (enmascarado)
 */
const crearTransportador = (): nodemailer.Transporter => {
  const config: ConfiguracionSMTP = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_PASS!
    }
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    // Configuraciones adicionales para Outlook
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    debug: process.env.NODE_ENV === 'development'
  })
}

/**
 * Generar contenido del correo para administradores
 */
const generarCorreoAdministradores = (datos: FormularioData): string => {
  const participacion = datos.participaraAsamblea === 'si' ? 'SÍ participará' : 'NO participará'
  const representacion = datos.representaraOtros 
    ? (datos.representaraOtros === 'si' ? 'SÍ representará a otros' : 'NO representará a otros')
    : 'No aplica'

  return `
FORMULARIO DE REPRESENTACIÓN - ASAMBLEA GENERAL COOPECOBANA

DATOS DEL ASOCIADO:
==================
Número de Asociado: ${datos.numeroAsociado}
Cédula: ${datos.cedula}
Nombre Completo: ${datos.nombreCompleto}
Correo Electrónico: ${datos.correoElectronico}
${datos.correoElectronicoSecundario ? `Correo Electrónico Secundario: ${datos.correoElectronicoSecundario}` : ''}
Teléfono Celular: ${datos.telefonoCelular || 'No proporcionado'}

PARTICIPACIÓN:
==============
Participará en la Asamblea: ${participacion}
Representará a otros asociados: ${representacion}

ADJUNTOS:
=========
Cantidad de archivos adjuntos: ${datos.archivos.length}
${datos.archivos.map((archivo, index) => 
  `${index + 1}. ${archivo.name} (${Math.round(archivo.size / 1024)} KB)`
).join('\n')}

--
Este correo fue generado automáticamente por el sistema de formularios de COOPECOBANA.
Fecha de envío: ${new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })}
`.trim()
}

/**
 * Generar contenido del correo de confirmación
 */
const generarCorreoConfirmacion = (datos: FormularioData): string => {
  return `
Estimado/a ${datos.nombreCompleto},

Su formulario de representación para la Asamblea General de COOPECOBANA ha sido recibido exitosamente.

RESUMEN DE SU ENVÍO:
===================
Número de Asociado: ${datos.numeroAsociado}
Cédula: ${datos.cedula}
Correo Principal: ${datos.correoElectronico}
${datos.correoElectronicoSecundario ? `Correo Secundario: ${datos.correoElectronicoSecundario}` : ''}
Participará en la Asamblea: ${datos.participaraAsamblea === 'si' ? 'Sí' : 'No'}
${datos.representaraOtros ? `Representará a otros: ${datos.representaraOtros === 'si' ? 'Sí' : 'No'}` : ''}
Archivos adjuntos: ${datos.archivos.length}

INFORMACIÓN IMPORTANTE:
======================
• Su información ha sido transmitida de forma segura
• No es necesario enviar el formulario nuevamente
• Conserve este correo como comprobante
• Para consultas, contacte a: achaconf@coopecobanarl.com

Gracias por su participación.

Atentamente,
COOPECOBANA R.L.
Asamblea General

--
NOTA: Este correo es enviado desde nuestro sistema automatizado.
Para consultas oficiales, escriba a: achaconf@coopecobanarl.com
Fecha: ${new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })}
`.trim()
}

/**
 * Convertir archivos a adjuntos para nodemailer
 */
const procesarAdjuntos = async (archivos: File[]) => {
  const adjuntos = await Promise.all(
    archivos.map(async (archivo) => {
      const buffer = await archivo.arrayBuffer()
      return {
        filename: archivo.name,
        content: Buffer.from(buffer),
        contentType: archivo.type
      }
    })
  )
  return adjuntos
}

/**
 * Enviar correo a los administradores
 */
export const enviarCorreoAdministradores = async (datos: FormularioData) => {
  const transportador = crearTransportador()
  const adjuntos = await procesarAdjuntos(datos.archivos)
  
  const opcionesCorreo = {
    from: {
      name: process.env.MAIL_FROM_NAME || 'COOPECOBANA R.L.',
      address: process.env.MAIL_FROM || 'noreply@coopecobanarl.com'
    },
    to: process.env.MAIL_TO_ADMIN?.split(',').map(email => email.trim()) || [],
    subject: `Nuevo Registro Asamblea - ${datos.numeroAsociado}`, // Asunto = número de asociado
    text: generarCorreoAdministradores(datos),
    attachments: adjuntos,
    replyTo: process.env.MAIL_REPLY_TO || 'achaconf@coopecobanarl.com'
  }

  return await transportador.sendMail(opcionesCorreo)
}

/**
 * Enviar correo de confirmación al asociado
 */
export const enviarCorreoConfirmacion = async (datos: FormularioData) => {
  console.log('🔄 Iniciando envío de correo de confirmación...')
  console.log('📧 Destinatario:', datos.correoElectronico)
  console.log('🔑 Usuario Gmail:', process.env.GMAIL_USER)
  
  const transportador = crearTransportador()
  
  const opcionesCorreo = {
    from: {
      name: process.env.MAIL_FROM_NAME || 'COOPECOBANA R.L.',
      address: process.env.MAIL_FROM || 'noreply@coopecobanarl.com'
    },
    to: datos.correoElectronico,
    subject: `Confirmación de envío – ${datos.numeroAsociado}`,
    text: generarCorreoConfirmacion(datos),
    replyTo: process.env.MAIL_REPLY_TO || 'achaconf@coopecobanarl.com'
  }

  console.log('📬 Opciones de correo:', {
    from: opcionesCorreo.from,
    to: opcionesCorreo.to,
    subject: opcionesCorreo.subject
  })

  return await transportador.sendMail(opcionesCorreo)
}

/**
 * Enviar correo de notificación de error
 */
export const enviarNotificacionError = async (datos: FormularioData, error: string) => {
  const transportador = crearTransportador()
  
  const contenidoError = `
ERROR EN ENVÍO DE FORMULARIO - COOPECOBANA

DATOS DEL INTENTO:
==================
Cédula: ${datos.cedula}
Nombre: ${datos.nombreCompleto}
Correo: ${datos.correoElectronico}
Fecha del error: ${new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })}

ERROR TÉCNICO:
==============
${error}

NOTA: Este envío falló y NO se procesó correctamente.
Los datos NO fueron adjuntados a este correo por seguridad.

--
Sistema de formularios COOPECOBANA
`.trim()

  const opcionesCorreo = {
    from: {
      name: process.env.MAIL_FROM_NAME || 'COOPECOBANA Sistema',
      address: process.env.MAIL_FROM || 'noreply@coopecobanarl.com'
    },
    to: process.env.MAIL_TO_ADMIN?.split(',').map(email => email.trim()) || [],
    subject: 'Error en envío de formulario',
    text: contenidoError,
    replyTo: process.env.MAIL_REPLY_TO || 'achaconf@coopecobanarl.com'
  }

  return await transportador.sendMail(opcionesCorreo)
}

/**
 * Validar configuración SMTP
 */
export const validarConfiguracionSMTP = (): boolean => {
  const variables = [
    'OUTLOOK_USER',
    'OUTLOOK_PASS',
    'MAIL_FROM',
    'MAIL_TO_ADMIN'
  ]
  
  return variables.every(variable => {
    const valor = process.env[variable]
    return valor && valor.trim() !== ''
  })
}

/**
 * Testear conexión SMTP
 */
export const testearConexionSMTP = async (): Promise<boolean> => {
  try {
    const transportador = crearTransportador()
    await transportador.verify()
    return true
  } catch (error) {
    console.error('Error de conexión SMTP:', error)
    return false
  }
}