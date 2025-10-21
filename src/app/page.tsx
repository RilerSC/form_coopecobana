'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormularioSchemaCompleto } from './lib/validations'
import { procesarFormulario } from './actions/submit'
import { useFormState, useFormAvailability } from './lib/utils'
import { 
  FormField, 
  NumericField, 
  FileUpload, 
  BinaryRadioGroup, 
  SubmitButton,
  ConvocatoriaDownload,
  CartaRepresentacionDownload
} from './components'
import type { FormularioInput } from './lib/validations'

export default function HomePage() {
  // Estado del formulario
  const router = useRouter()
  const { isOpen, timeRemaining, closeDate } = useFormAvailability()
  const { isLoading, isError, error, setLoading, setError } = useFormState()
  const [files, setFiles] = useState<File[]>([])
  const [showRepresentacion, setShowRepresentacion] = useState(false)

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormularioInput>({
    resolver: zodResolver(FormularioSchemaCompleto),
    mode: 'onBlur' // Validar cuando el usuario salga del campo
  })

  // Watch para participación
  const participaraAsamblea = watch('participaraAsamblea')
  const representaraOtros = watch('representaraOtros')

  // Efecto para mostrar/ocultar pregunta de representación
  useEffect(() => {
    if (participaraAsamblea === 'si' || participaraAsamblea === 'no') {
      setShowRepresentacion(true)
    } else {
      setShowRepresentacion(false)
      setValue('representaraOtros', undefined)
      // Limpiar archivos si se oculta la sección
      setFiles([])
    }
  }, [participaraAsamblea, setValue])

  // Efecto para limpiar archivos cuando no se necesita la sección de documentos
  useEffect(() => {
    const mostrarDocumentos = participaraAsamblea === 'no' && representaraOtros === 'si'
    if (!mostrarDocumentos) {
      setFiles([])
    }
  }, [participaraAsamblea, representaraOtros])

  // Efecto para sincronizar archivos con React Hook Form
  useEffect(() => {
    setValue('archivos', files)
  }, [files, setValue])

  // Si el formulario está cerrado, redirigir
  if (!isOpen) {
    window.location.href = '/cerrado'
    return null
  }

  // Envío del formulario
  const onSubmit = async (data: FormularioInput) => {
    console.log('🚀 onSubmit ejecutado', data)
    console.log('📁 Archivos en data:', data.archivos?.length || 0)
    
    try {
      setLoading()
      
      // Crear FormData para envío
      const formData = new FormData()
      
      // Agregar campos de texto
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'archivos' && value !== undefined) {
          formData.append(key, value.toString())
        }
      })
      
      // Agregar archivos (ahora desde data.archivos)
      if (data.archivos) {
        data.archivos.forEach((file) => {
          formData.append('archivos', file)
        })
      }
      
      console.log('📤 Enviando formulario...')
      
      // Enviar formulario
      const resultado = await procesarFormulario(formData)
      
      console.log('📨 Resultado:', resultado)
      
      if (resultado.success) {
        // Éxito: redirigir a página de confirmación
        if (resultado.redirect) {
          router.push(resultado.redirect)
        }
      } else {
        // Error: mostrar mensaje
        setError(resultado.error || 'Error al enviar el formulario')
      }
      
    } catch (error) {
      console.error('❌ Error en onSubmit:', error)
      setError('Error de conexión. Intente nuevamente.')
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header informativo */}
        <div className="bg-coopecobana-50 border border-coopecobana-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-coopecobana-900 mb-2">
            Formulario de Representación - Asamblea General
          </h2>
          <div className="text-sm text-coopecobana-800 space-y-2">
            <p>
              Complete este formulario para registrar su participación en la 
              <strong> Asamblea General de COOPECOBANA</strong>.
            </p>
            <p>
              <strong>Tiempo restante:</strong> {timeRemaining}
            </p>
            <p>
              <strong>Fecha límite:</strong> {closeDate}
            </p>
            <p>
              <strong>Archivos permitidos:</strong> PDF, JPG, PNG, DOCX (máximo 10MB cada uno, 20MB total)
            </p>
          </div>
        </div>

        {/* Descarga de Convocatoria - Visible para todos */}
        <div className="mb-8">
          <ConvocatoriaDownload />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Datos personales */}
          <div className="form-section">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Datos del Asociado
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NumericField
                label="Número de Empleado BNCR"
                placeholder="Ej: 012345"
                required
                error={errors.numeroAsociado?.message}
                {...register('numeroAsociado')}
              />
              
              <NumericField
                label="Cédula"
                placeholder="Ej: 301020999"
                required
                error={errors.cedula?.message}
                {...register('cedula')}
              />
            </div>
            
            <div className="mt-6">
              <FormField
                label="Nombre Completo"
                placeholder="Ej: Juan Pérez López"
                required
                error={errors.nombreCompleto?.message}
                {...register('nombreCompleto')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormField
                type="email"
                label="Correo Electrónico (No dominio BNCR)"
                placeholder="Ej: juan@email.com"
                required
                error={errors.correoElectronico?.message}
                {...register('correoElectronico')}
              />
              
              <FormField
                type="email"
                label="Correo Electrónico Secundario (Opcional)"
                placeholder="Ej: juan.secundario@email.com"
                error={errors.correoElectronicoSecundario?.message}
                {...register('correoElectronicoSecundario')}
              />
            </div>
            
            <div className="mt-6">
              <FormField
                type="tel"
                label="Teléfono Celular (Opcional)"
                placeholder="Ej: 88888888"
                error={errors.telefonoCelular?.message}
                {...register('telefonoCelular')}
              />
            </div>
          </div>

          {/* Participación */}
          <div className="form-section">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Participación en la Asamblea
            </h3>
            
            <BinaryRadioGroup
              label="¿Participará en la Asamblea General?"
              name="participaraAsamblea"
              value={participaraAsamblea}
              onChange={(value: string) => setValue('participaraAsamblea', value as 'si' | 'no')}
              required
              error={errors.participaraAsamblea?.message}
            />
            
            {/* Pregunta condicional de representación */}
            {showRepresentacion && (participaraAsamblea === 'si' || participaraAsamblea === 'no') && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <BinaryRadioGroup
                  label={
                    participaraAsamblea === 'si' 
                      ? "¿Desea representar a otros asociados?" 
                      : "¿Desea ser representado por otro asociado?"
                  }
                  name="representaraOtros"
                  value={watch('representaraOtros')}
                  onChange={(value: string) => setValue('representaraOtros', value as 'si' | 'no')}
                  required
                  error={errors.representaraOtros?.message}
                />
                
                {/* Descarga de carta de representación SOLO si NO participa y dice que SÍ desea ser representado */}
                {participaraAsamblea === 'no' && watch('representaraOtros') === 'si' && (
                  <div className="mt-6">
                    <div className="mb-4 p-4 bg-cooperativa-50 border border-cooperativa-200 rounded-lg">
                      <h4 className="font-semibold text-cooperativa-900 mb-2">
                        📋 Instrucciones importantes
                      </h4>
                      <ul className="text-sm text-cooperativa-800 space-y-1 list-disc list-inside">
                        <li>Descargue la carta de representación</li>
                        <li>Complete todos los campos requeridos (sus datos y los del representante)</li>
                        <li>Firme el documento</li>
                        <li>Pídale al representante que también firme</li>
                        <li>Escanee o fotografíe la carta firmada</li>
                        <li>Suba el archivo (PDF, JPG o PNG) en la sección "Documentos Adjuntos"</li>
                      </ul>
                    </div>
                    <CartaRepresentacionDownload />
                  </div>
                )}
                
                {/* Mensaje informativo si SÍ participa y dice que SÍ representará a otros */}
                {participaraAsamblea === 'si' && watch('representaraOtros') === 'si' && (
                  <div className="mt-4 p-4 bg-coopecobana-50 border border-coopecobana-200 rounded-lg">
                    <p className="text-sm text-coopecobana-800">
                      ✅ <strong>Perfecto!</strong> Su disponibilidad para representar otros asociados ha sido registrada. 
                      La administración podrá contactarle si hay asociados que necesiten representación.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Documentos - Solo visible cuando NO participa y SÍ quiere ser representado */}
          {participaraAsamblea === 'no' && watch('representaraOtros') === 'si' && (
            <div className="form-section">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Documentos Adjuntos
              </h3>
              
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  📎 <strong>Importante:</strong> Debe adjuntar la carta de representación completada y firmada por ambas partes (usted y su representante).
                </p>
              </div>
              
              <FileUpload
                onFilesChange={setFiles}
                currentFiles={files}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Error general */}
          {isError && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Botón de envío */}
          <div className="pt-6">
            <SubmitButton
              loading={isLoading}
              disabled={isLoading}
            >
              Enviar Formulario
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}