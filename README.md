# 📋 Formulario de Representación COOPECOBANA

Sistema web desarrollado en Next.js para recolectar información de asociados para la Asamblea General de COOPECOBANA R.L.

## 🎯 Características principales

- ✅ **Sin base de datos** - envío directo por correo electrónico
- ✅ **Formulario temporal** - disponible hasta el 6 de noviembre 2025, 1:00 AM
- ✅ **Adjuntos permitidos** - PDF, JPG, PNG (máx. 10MB c/u, 20MB total)
- ✅ **Validaciones robustas** - TypeScript + Zod
- ✅ **Correos automáticos** - confirmación al asociado + envío a administradores
- ✅ **Responsive design** - optimizado para móviles y escritorio

## 🛠️ Stack tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript (estricto)
- **Estilos:** Tailwind CSS
- **Formularios:** react-hook-form + zod
- **Correo:** Nodemailer (Outlook SMTP)
- **Archivos:** Formidable
- **Fechas:** dayjs

## 🚀 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd FORM_COOPECOBANA
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Editar `.env.local` con las credenciales reales:
   ```env
   OUTLOOK_USER=coopecobana@outlook.com
   OUTLOOK_PASS=tu_password_real
   MAIL_TO_ADMIN="email1@coopecobana.com,email2@coopecobana.com"
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

5. **Construir para producción:**
   ```bash
   npm run build
   npm start
   ```

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── actions/
│   │   └── submit.ts          # Server Actions
│   ├── components/
│   │   ├── FormField.tsx      # Campo de formulario
│   │   ├── FileUpload.tsx     # Subida de archivos
│   │   └── Button.tsx         # Botón reutilizable
│   ├── lib/
│   │   ├── validations.ts     # Validaciones Zod
│   │   └── email.ts           # Utilidades SMTP
│   ├── types/
│   │   └── index.ts           # Tipos TypeScript
│   ├── enviado/
│   │   └── page.tsx           # Página de éxito
│   ├── cerrado/
│   │   └── page.tsx           # Página de cierre
│   ├── page.tsx               # Formulario principal
│   ├── layout.tsx             # Layout raíz
│   └── globals.css            # Estilos globales
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Páginas del sistema

### 1. **Página principal** (`/`)
- Formulario de captura de datos
- Validación en tiempo real
- Subida de archivos drag & drop
- Verificación de fecha límite

### 2. **Página de éxito** (`/enviado`)
- Confirmación de envío exitoso
- Información sobre próximos pasos
- Datos de contacto para consultas

### 3. **Página de cierre** (`/cerrado`)
- Mensaje de formulario cerrado
- Información de contacto alternativa
- Se muestra automáticamente después del 6/11/2025

## 📧 Flujo de correos

1. **Al administrador:**
   - Asunto: número de cédula del asociado
   - Contenido: todos los datos del formulario
   - Adjuntos: archivos subidos por el asociado

2. **Al asociado:**
   - Asunto: "Confirmación de envío – [cédula]"
   - Contenido: resumen del envío y confirmación
   - Sin adjuntos

3. **En caso de error:**
   - Al administrador únicamente
   - Detalles técnicos del error
   - Datos del asociado (sin adjuntos)

## ⚙️ Configuración de entorno

### Variables requeridas

```env
# SMTP Outlook
OUTLOOK_USER=coopecobana@outlook.com
OUTLOOK_PASS=password_real

# Configuración de correos
MAIL_FROM_NAME="COOPECOBANA"
MAIL_FROM="coopecobana@outlook.com"
MAIL_TO_ADMIN="admin1@coopecobana.com,admin2@coopecobana.com"

# Fecha límite (ISO 8601)
FORM_CLOSE_DATE="2025-11-06T01:00:00-06:00"

# Zona horaria
TZ=America/Costa_Rica
```

## 🚦 Validaciones implementadas

- **Número de asociado:** solo dígitos
- **Cédula:** solo números, sin guiones
- **Email:** formato válido estricto
- **Archivos:** PDF/JPG/PNG, máx. 10MB c/u, 20MB total
- **Fecha:** formulario se cierra automáticamente
- **Campos requeridos:** validación client-side y server-side

## 🔐 Seguridad

- ✅ Headers de seguridad configurados
- ✅ Validación dual (cliente + servidor)
- ✅ No almacenamiento de datos sensibles
- ✅ HTTPS requerido en producción
- ✅ Límites de tamaño de archivos
- ✅ Sanitización de inputs

## 🌐 Despliegue (BanaHosting)

1. **Construir el proyecto:**
   ```bash
   npm run build
   ```

2. **Subir archivos:**
   - Subir contenido de `.next/` y `public/`
   - Configurar Node.js en el panel de control
   - Asegurar acceso al puerto 587 (SMTP)

3. **Variables de entorno:**
   - Configurar en el panel de BanaHosting
   - Verificar zona horaria del servidor

## 🐛 Troubleshooting

### Error de SMTP
```bash
# Verificar credenciales
npm run test-smtp
```

### Error de archivos grandes
- Verificar `MAX_FILE_SIZE_MB` en `.env.local`
- Confirmar límites del hosting

### Error de fecha/zona horaria
- Verificar `TZ=America/Costa_Rica`
- Confirmar `FORM_CLOSE_DATE` en formato correcto

## 📝 Scripts disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción  
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificación de tipos
```

## 👥 Equipo de desarrollo

**Desarrollado por:** Equipo de Tecnología COOPECOBANA  
**Contacto:** coopecobana@outlook.com  
**Versión:** 1.0  
**Fecha:** Octubre 2025  

---

## 📄 Licencia

© 2025 COOPECOBANA R.L. - Todos los derechos reservados.

Este proyecto es de uso interno exclusivo para COOPECOBANA R.L.