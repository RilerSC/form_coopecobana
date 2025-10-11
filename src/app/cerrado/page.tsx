export default function CerradoPage() {
  return (
    <div className="container py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center">
          {/* Ícono de reloj */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
            <svg 
              className="h-8 w-8 text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Formulario cerrado
          </h1>
          
          {/* Mensaje principal */}
          <div className="text-gray-600 mb-8 space-y-4">
            <p className="text-lg">
              Este formulario ya no recibe respuestas.
            </p>
            <p>
              El período de recepción de formularios de representación 
              para la Asamblea General de COOPECOBANA finalizó el 
              <strong className="text-gray-900"> 6 de noviembre de 2025 a la 1:00 AM</strong>.
            </p>
          </div>
          
          {/* Información de contacto */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mb-8">
            <h3 className="font-semibold text-yellow-900 mb-3">
              ¿Necesita ayuda?
            </h3>
            <div className="text-sm text-yellow-800 space-y-2">
              <p>
                Si tiene consultas sobre la Asamblea General o necesita 
                asistencia, contacte directamente a:
              </p>
              <div className="mt-4 space-y-1">
                <p className="font-medium">COOPECOBANA R.L.</p>
                <p>Correo: achaconf@coopecobanarl.com</p>
                <p>O comuníquese con nuestras oficinas durante horario de atención.</p>
              </div>
            </div>
          </div>
          
          {/* Información adicional */}
          <div className="text-sm text-gray-500">
            <p>
              Los asociados que enviaron su formulario a tiempo recibirán 
              información adicional sobre la Asamblea General por correo electrónico.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}