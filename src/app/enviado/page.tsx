export default function EnviadoPage() {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          {/* Ícono de éxito */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Formulario enviado exitosamente!
          </h1>
          
          {/* Mensaje */}
          <div className="text-gray-600 mb-8 space-y-3">
            <p>
              Su formulario de representación ha sido enviado correctamente 
              a los correos institucionales de COOPECOBANA.
            </p>
            <p>
              En breve recibirá un correo de confirmación en la dirección 
              electrónica que proporcionó.
            </p>
            <p className="text-sm text-gray-500">
              Si no recibe el correo de confirmación en los próximos minutos, 
              revise su carpeta de spam o correo no deseado.
            </p>
          </div>
          
          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              Información importante:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Su información ha sido transmitida de forma segura</li>
              <li>• No es necesario enviar el formulario nuevamente</li>
              <li>• Conserve este mensaje como comprobante</li>
              <li>• El formulario se cierra el 6 de noviembre de 2025 a la 1:00 AM</li>
            </ul>
          </div>
          
          {/* Contacto */}
          <div className="text-sm text-gray-500">
            <p>
              Para consultas adicionales, contacte a:
            </p>
            <p className="font-medium text-gray-700 mt-1">
              COOPECOBANA R.L.
            </p>
            <p>
              Correo: achaconf@coopecobanarl.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}