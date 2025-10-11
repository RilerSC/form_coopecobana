# 🖥️ Interfaz de Usuario y Comportamiento – Formulario de Representación COOPECOBANA
**Versión:** 1.0  
**Fecha:** Octubre 2025  
**Autor:** Equipo de Tecnología COOPECOBANA  

---

## 🎯 Objetivo
Definir la estructura visual, comportamiento y estilo de la **interfaz de usuario (UI)** del Formulario de Representación de COOPECOBANA.  
Este documento sirve como guía de implementación para GitHub Copilot Pro y para mantener coherencia visual y funcional durante el desarrollo.

---

## 🧩 Principios generales de diseño

| Principio | Descripción |
|------------|-------------|
| **Simplicidad** | Mostrar solo los campos necesarios. Evitar saturación visual. |
| **Claridad** | Mensajes cortos y explícitos; botones con verbos de acción (“Enviar formulario”). |
| **Consistencia** | Todos los inputs con estilo homogéneo, esquinas redondeadas y padding cómodo. |
| **Responsividad** | Adaptado a dispositivos móviles, tablet y escritorio. |
| **Accesibilidad básica** | Contraste suficiente, tamaño de texto legible, navegación por teclado. |
| **Idioma** | Toda la interfaz en **español**. |
| **Sin autenticación** | Acceso directo sin inicio de sesión. |

---

## 🎨 Stack de interfaz

- **Framework:** Next.js (App Router)  
- **Lenguaje:** TypeScript  
- **Librerías UI:**  
  - **Tailwind CSS** (estilos utilitarios)  
  - **react-hook-form** (manejo de estado del formulario)  
  - **zod** (validaciones tipadas)  
  - **shadcn/ui** (opcional para botones y alertas)  
- **Iconografía:** Lucide React (opcional)  
- **Sin dependencias de diseño visual pesadas** (no MUI ni Bootstrap).

---

## 🧱 Estructura visual del formulario

### 📄 Página principal `/`
**Objetivo:** Capturar y validar toda la información requerida.

#### Layout general

│ LOGO y título                             │
│—————————————––│
│ Mensaje informativo inicial               │
│—————————————––│
│ Formulario de ingreso                     │
│   - Datos personales                      │
│   - Intención de participación            │
│   - Representación                        │
│   - Adjuntar documento(s)                 │
│—————————————––│
│ Botón [Enviar formulario]                 │
│—————————————––│
│ Mensaje de estado (éxito / error)         │

#### Secciones y campos

1. **Encabezado**
   - Logotipo de la cooperativa (versión liviana SVG).  
   - Título: **“Formulario de Representación Asamblea General”**.  
   - Subtítulo: fecha límite y hora local: _“Disponible hasta el 6 de noviembre de 2025, 1:00 a.m.”_  
   - Mensaje breve sobre propósito del formulario.

2. **Datos del asociado**
   | Campo | Tipo | Placeholder | Validación | Requerido |
   |--------|------|-------------|-------------|------------|
   | Número de asociado | Texto | `Ej: 012345` | Solo dígitos | ✅ |
   | Cédula | Texto | `Ej: 301020999` | Solo dígitos | ✅ |
   | Nombre completo | Texto | `Ej: Juan Pérez López` | ≥ 3 caracteres | ✅ |
   | Correo electrónico | Email | `Ej: juan@email.com` | Formato email válido | ✅ |
   | Teléfono celular | Texto | `Ej: 88888888` | Solo dígitos | ⭕ Opcional |

3. **Intención de participación**
   - Pregunta: “¿Participará en la Asamblea General?”  
   - Opción tipo **radio button**:  
     - `Sí participaré`  
     - `No participaré`
   - Si selecciona **“Sí participaré”**, aparece la siguiente pregunta:
     - “¿Representará a otros asociados?” → opciones `Sí` / `No`.

4. **Documento adjunto**
   - Componente `<FileDropzone />` con arrastrar y soltar o botón “Seleccionar archivos”.  
   - Tipos aceptados: `.pdf, .jpg, .png`.  
   - Mostrar contador de archivos y tamaño total:  
     - “3 archivos seleccionados (12.3 MB de 20 MB permitidos)”.  
   - Mensaje de error si excede 10 MB por archivo o 20 MB total.

5. **Botón de envío**
   - Texto: **“Enviar formulario”**.  
   - Estado:  
     - Normal → azul/verde.  
     - Loading → spinner + “Enviando...”.  
   - Deshabilitado mientras se procesa.

6. **Mensajes de estado**
   - Éxito: verde → “Tu formulario ha sido enviado. Revisa tu correo para la confirmación.”  
   - Error: rojo → “No pudimos enviar tu solicitud. Por favor, inténtalo de nuevo.”  
   - Límite excedido: ámbar → “El tamaño de los archivos supera el límite de 20 MB.”

---

## 📄 Página `/enviado`
**Propósito:** confirmar al usuario que el formulario se envió correctamente.  

**Contenido sugerido:**

- Botón “Volver al inicio” (redirige a `/`).
- Fondo limpio, color verde suave o blanco con icono de éxito.

---

## 📄 Página `/cerrado`
**Propósito:** mostrar mensaje cuando la fecha de cierre ha sido superada.  
**Contenido sugerido:**

Colores base (Tailwind)
Elemento
Color sugerido
Fondo principal
bg-white
Fondo alterno
bg-gray-50
Botón principal
bg-blue-600 hover:bg-blue-700 text-white
Éxito
text-green-600
Error
text-red-600
Warning
text-amber-500
