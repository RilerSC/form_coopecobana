# 🧩 Proyecto: Formulario de Representación – COOPECOBANA
**Versión:** 1.0  
**Fecha:** Octubre 2025  
**Autor:** Equipo de Tecnología COOPECOBANA  
**Objetivo:** Documentar el stack tecnológico, dependencias y consideraciones técnicas del proyecto para asistir la generación automática de código con GitHub Copilot Pro y otros asistentes de desarrollo.

---

## 🚀 Descripción general
Este proyecto consiste en un **formulario web desarrollado con Next.js** para recolectar información de asociados y enviar los datos por **correo electrónico**, junto con los documentos adjuntos (PDF o imágenes) a los correos institucionales definidos.  
No se almacenan datos en bases de datos ni en el servidor; el formulario sirve únicamente como **canal seguro de envío de información**.

El formulario estará activo **hasta el 6 de noviembre de 2025, a la 1:00 a.m. (hora Costa Rica)**.  
Después de esa fecha, se mostrará automáticamente un mensaje de cierre.

---

## ⚙️ Stack tecnológico

### Framework principal
- **Next.js (App Router)**  
  - Versión recomendada: `>=14.x`  
  - Uso de **Server Actions** y **TypeScript**  
  - **Rutas:** `/`, `/enviado`, `/cerrado`  
  - **SSR habilitado** solo donde sea necesario.

### Lenguaje
- **TypeScript** para todo el código de front y back.  
  - Estricto (`"strict": true` en `tsconfig.json`).

### UI y estilos
- **Tailwind CSS** (con configuración base).
- **shadcn/ui** opcional para componentes si se desea un acabado más moderno.
- Diseño limpio, accesible y adaptable (responsive).
- Idioma de la interfaz: **español**.

### Formularios y validación
- **react-hook-form** → manejo del estado del formulario.
- **zod** → validación tipada y sanitización de datos.  
  Validaciones definidas:
  - `numeroAsociado`: solo dígitos, sin límite de longitud.
  - `cedula`: solo dígitos, sin guiones ni espacios.
  - `email`: formato válido general.
  - `archivos`: tipos aceptados `PDF, JPG, PNG`; máximo **10 MB por archivo** y **20 MB total**.

### Manejo de archivos
- Librería sugerida: **formidable** o **busboy** para procesar `multipart/form-data` por streams.
- Los archivos **no se guardan** en el servidor.  
  Se procesan en memoria o stream y se adjuntan directamente al correo.
- Al superar el límite total (20 MB) se rechaza el envío con un mensaje claro.

### Correo (SMTP)
- **Nodemailer** con **Outlook SMTP**  
  - Servidor: `smtp.office365.com`  
  - Puerto: `587`  
  - Seguridad: STARTTLS  
  - Usuario: `coopecobana@outlook.com`
  - Autenticación básica (user + pass).  
- Los mensajes no se almacenan ni registran en BD.
- **Asuntos:**
  - A los correos administrativos: número de cédula.  
  - Al asociado: “Confirmación de envío – [cédula]”.
- **Cuerpo:** texto plano.
- **Adjuntos:** archivos enviados en el formulario.
- **Destinatarios administrativos:** definidos en el caso de uso.  
- **Confirmación:** se envía automáticamente al asociado tras éxito del envío.

### Seguridad
- HTTPS (proporcionado por el hosting o Cloudflare).  
- Sin almacenamiento de datos sensibles en disco.  
- Sin cookies de sesión.  
- Sin base de datos.  
- No se usa ReCAPTCHA en la primera fase (se añadirá después).  
- No se realiza cifrado en tránsito adicional al TLS del SMTP.

### Hosting
- **BanaHosting**, entorno compartido con soporte para **Node.js 18+**.  
  - Despliegue mediante carpeta `/nextjs` o `/app` según configuración del proveedor.  
  - Límite recomendado de `request body`: 25 MB.  
  - Requiere acceso saliente al puerto **587** (para Outlook SMTP).

### Variables de entorno (.env.local)
```bash
OUTLOOK_USER=coopecobana@outlook.com
OUTLOOK_PASS=Coope2023
MAIL_FROM_NAME="COOPECOBANA"
MAIL_FROM="coopecobana@outlook.com"
MAIL_REPLY_TO="coopecobana@outlook.com"
MAIL_TO_ADMIN="achaconf@coopecobanarl.com,mcastrohe@coopecobanarl.com"
TZ=America/Costa_Rica

### Dependencias Recomendadas
npm install next@latest react react-dom typescript tailwindcss postcss autoprefixer \
  react-hook-form zod nodemailer formidable dayjs

  ### Estructura de Carpetas Sugeridas
  src/
 ├─ app/
 │   ├─ actions/
 │   │   └─ submit.ts          # Server Action principal
 │   ├─ page.tsx               # Página principal del formulario
 │   ├─ enviado/page.tsx       # Pantalla de confirmación
 │   ├─ cerrado/page.tsx       # Pantalla de formulario cerrado
 │   └─ layout.tsx
 │
 ├─ components/
 │   ├─ FormFields.tsx
 │   ├─ FileDropzone.tsx
 │   └─ StatusBanner.tsx
 │
 ├─ lib/
 │   ├─ mail.ts                # Cliente Nodemailer (Outlook)
 │   ├─ dateGuard.ts           # Verificación de cierre automático
 │   └─ validation.ts          # Esquema zod
 │
 ├─ styles/
 │   └─ globals.css
 │
 └─ env.d.ts                   # Tipado de variables de entorno

 ### Buenas prácticas adicionales
	•	Usar try/catch en submit.ts para capturar fallos SMTP y responder con error claro.
	•	Si el envío a Outlook falla, reenviar notificación a los correos administrativos (sin adjuntos).
	•	Log mínimo a consola (no en archivos persistentes).
	•	Evitar dependencias pesadas (optimizar para hosting compartido).
	•	Mantener los límites de tamaño estrictos para evitar saturar el servidor.