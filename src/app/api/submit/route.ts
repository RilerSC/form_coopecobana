import { NextRequest, NextResponse } from 'next/server';
import { enviarCorreoAdministradores, enviarCorreoConfirmacion } from '@/lib/email';
import { FormularioSchema, validarArchivos } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extraer datos del formulario
    const data = {
      nombre: formData.get('nombre') as string,
      cedula: formData.get('cedula') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string,
      participara: formData.get('participara') as string,
      representante_nombre: formData.get('representante_nombre') as string || undefined,
      representante_cedula: formData.get('representante_cedula') as string || undefined,
    };

    // Validar datos
    const validatedData = FormularioSchema.parse(data);

    // Procesar archivos
    const files: File[] = [];
    for (let i = 1; i <= 3; i++) {
      const file = formData.get(`archivo${i}`) as File | null;
      if (file && file.size > 0) {
        files.push(file);
      }
    }

    // Validar archivos
    validarArchivos(files);

    // Enviar emails
    try {
      // Enviar email a administradores
      await enviarCorreoAdministradores(validatedData);
      
      // Enviar confirmación al usuario
      await enviarCorreoConfirmacion(validatedData);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Formulario enviado exitosamente',
          redirect: '/enviado'
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      return NextResponse.json(
        { error: 'Error enviando el formulario. Por favor intente nuevamente.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error procesando formulario:', error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Datos del formulario inválidos' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}