# 📘 Caso de Uso y Diagrama Funcional – Formulario de Representación COOPECOBANA
**Versión:** 1.0  
**Fecha:** Octubre 2025  
**Autor:** Equipo de Tecnología COOPECOBANA  

---

## 🎯 Objetivo
Desarrollar un **formulario web** que permita a los asociados de COOPECOBANA registrar su intención de participación en la Asamblea General, adjuntar la carta de representación (o el documento correspondiente), y enviar esta información a los correos institucionales definidos.  
El sistema no almacena datos ni adjuntos; su única función es **transmitir la información de manera segura** mediante correo electrónico.

---

## 👥 Actores principales

| Actor | Descripción |
|-------|--------------|
| **Asociado** | Persona miembro de la cooperativa que completa y envía el formulario. |
| **Sistema Web (Formulario)** | Aplicación en Next.js encargada de recibir, validar y procesar los datos. |
| **Servidor de Correo (Outlook SMTP)** | Servicio que gestiona el envío de correos electrónicos salientes. |
| **Administradores / Comité** | Personas que reciben los correos con la información y los adjuntos. |
| **Correo del Asociado** | Destinatario del correo de confirmación que acredita el envío exitoso. |

---

## 📄 Caso de Uso: Enviar Formulario de Representación

| Elemento | Descripción |
|-----------|-------------|
| **ID** | CU-FR-01 |
| **Nombre** | Enviar Formulario de Representación |
| **Actor principal** | Asociado |
| **Propósito** | Permitir que el asociado envíe su formulario de representación antes del cierre definido. |
| **Precondiciones** | <ul><li>El formulario está disponible (antes del 6 de noviembre de 2025, 01:00 a.m.).</li><li>El asociado cuenta con conexión a Internet y acceso al formulario.</li></ul> |
| **Postcondiciones** | <ul><li>Los correos son enviados correctamente a los destinatarios institucionales.</li><li>El asociado recibe confirmación por correo electrónico.</li></ul> |

### 🧭 Flujo principal
1. El asociado ingresa al sitio del formulario.  
2. El sistema verifica la fecha actual.  
   - Si es posterior al **6/11/2025 01:00 a.m.**, redirige a la pantalla **“Formulario cerrado”**.  
3. El asociado completa los campos requeridos:
   - Número de asociado  
   - Cédula (solo números)  
   - Nombre completo  
   - Correo electrónico  
   - Teléfono (opcional)  
   - Intención de participación (Sí/No)  
   - Deseo de representación (Sí/No)  
   - Adjunta documentos (PDF, JPG, PNG – máximo 10 MB cada uno, 20 MB total).  
4. El sistema valida los campos localmente (zod + react-hook-form).  
5. El asociado envía el formulario.  
6. El servidor:
   - Valida nuevamente los datos.  
   - Verifica el tamaño total de los adjuntos.  
   - Genera los dos correos:
     1. **Correo a los destinatarios institucionales** con asunto = cédula y adjuntos.
     2. **Correo de confirmación al asociado**.  
7. Si el envío es exitoso:
   - Redirige a `/enviado` con mensaje de éxito.  
8. Si ocurre error SMTP o tamaño excedido:
   - Muestra mensaje de error.  
   - Envía notificación de error al comité (sin adjuntos).

---

## 🔁 Flujo alternativo (Formulario cerrado)
1. El asociado intenta acceder después del **06/11/2025 01:00**.  
2. El servidor detecta la fecha.  
3. El sistema muestra la pantalla `/cerrado` con mensaje:  
   _“Este formulario ya no recibe respuestas.”_

---

## 🚫 Flujo alternativo (Error de envío)
1. Fallo en el envío de correo por tamaño, red o autenticación SMTP.  
2. El sistema muestra pantalla de error.  
3. En paralelo, se genera un correo de alerta a los administradores con los datos del intento (sin adjuntos).

---

## 📧 Correos generados

| Tipo | Destinatario | Asunto | Contenido | Adjuntos |
|------|---------------|---------|------------|-----------|
| Envío institucional | `achaconf@..., mcastrohe@...` | `[cédula]` | Datos del asociado y selección de participación | Sí |
| Confirmación | Correo del asociado | `Confirmación de envío – [cédula]` | Mensaje corto de confirmación de envío exitoso | No |
| Error (solo si ocurre) | Correos institucionales | `Error en envío de formulario` | Detalle del error técnico | No |

---

## 🧩 Reglas del negocio
- El formulario estará disponible **hasta el 6/noviembre/2025 a la 1:00 a.m.**.  
- Solo se aceptan archivos **PDF, JPG o PNG**.  
- Máximo **10 MB por archivo** y **20 MB en total**.  
- Los datos enviados **no se almacenan** en servidor ni base de datos.  
- No hay autenticación ni inicio de sesión.  
- No se permite editar o reenviar después del envío.  
- Si el correo falla, se notifica al comité (sin persistencia del intento).  
- Se enviará confirmación automática al asociado.  
- Todo el contenido y mensajes estarán en **español**.

---

## 🧭 Diagrama funcional (Mermaid)

```mermaid
flowchart TD

A[Inicio] --> B{¿Fecha < 6/11/2025 01:00?}
B -- No --> Z[Mostrar mensaje "Formulario cerrado"]
B -- Sí --> C[Llenar formulario]
C --> D[Validar campos y archivos (Zod)]
D --> E{¿Validación OK?}
E -- No --> F[Mostrar errores en pantalla]
E -- Sí --> G[Enviar datos al servidor]
G --> H{¿Tamaño total <= 20 MB?}
H -- No --> F2[Error: Archivos exceden límite]
H -- Sí --> I[Procesar y enviar correos vía Outlook SMTP]
I --> J{¿Envío exitoso?}
J -- No --> K[Enviar alerta a administradores]
K --> L[Mostrar mensaje de error al usuario]
J -- Sí --> M[Enviar confirmación al asociado]
M --> N[Redirigir a pantalla /enviado]
N --> O[Fin]