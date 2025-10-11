# 🚀 INSTRUCCIONES DE DESPLIEGUE BANAHOSTIN
# COOPECOBANA - Formulario Asamblea General

## 📁 ARCHIVOS PARA SUBIR AL HOSTING

**IMPORTANTE**: Solo necesitas subir la carpeta `.next/standalone/` completa

### ✅ Contenido a subir:
```
📁 .next/standalone/
├── 📄 .env.production          # Variables de entorno
├── 📄 start.js                 # Script de inicio personalizado  
├── 📄 server.js                # Servidor Next.js
├── 📄 package.json             # Dependencias
├── 📁 .next/                   # Aplicación compilada
├── 📁 node_modules/            # Dependencias instaladas
└── 📁 public/                  # Archivos estáticos
    ├── Logo.png
    ├── logo-blanco.png
    ├── CONVOCATORIA.pdf
    └── CARTA_REPRESENTACION.docx
```

## 🔧 PASOS EN BANAHOSTIN:

### 1️⃣ Subir archivos
- Sube TODA la carpeta `.next/standalone/` a la raíz de tu hosting
- Asegúrate de mantener la estructura de carpetas

### 2️⃣ Configurar variables de entorno
En el panel de Banahostin, configura estas variables:
```bash
NODE_ENV=production
PORT=3000
TZ=America/Costa_Rica
```

### 3️⃣ Comandos de inicio
En Banahostin, configura el comando de inicio:
```bash
node start.js
```

**Alternativo (si start.js no funciona):**
```bash
node server.js
```

### 4️⃣ Dominio personalizado
Una vez configurado el dominio, actualiza en `.env.production`:
```
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

## 🔐 VARIABLES DE ENTORNO IMPORTANTES

Las siguientes variables están en `.env.production` y son críticas:

```bash
# Gmail SMTP (YA CONFIGURADO)
GMAIL_USER=riler.salmista@gmail.com
GMAIL_PASS="ppxp pzxe alor vtqu"

# Correos corporativos
MAIL_FROM="noreply@coopecobana.com"
MAIL_TO_ADMIN="achaconf@coopecobanarl.com,mcastrohe@coopecobanarl.com"

# Fecha de cierre
FORM_CLOSE_DATE="2025-11-06T01:00:00-06:00"
```

## ⚡ VERIFICACIÓN POST-DESPLIEGUE

1. **Probar formulario**: Envía un formulario de prueba
2. **Verificar emails**: Confirma que lleguen a los correos configurados
3. **Descargas**: Verifica que los documentos se descarguen correctamente
4. **Responsive**: Prueba en móvil y desktop

## 🆘 TROUBLESHOOTING

**Si el sitio no carga:**
- Verifica que `node_modules/` esté completo
- Revisa los logs del hosting para errores
- Confirma que el puerto 3000 esté disponible

**Si los emails no llegan:**
- Verifica las credenciales de Gmail en `.env.production`
- Revisa que las contraseñas no tengan espacios extra
- Confirma que el hosting permita conexiones SMTP externas

**Si las descargas fallan:**
- Verifica que la carpeta `public/` esté completa
- Confirma que los archivos PDF y DOCX no estén corruptos

## 📞 SOPORTE

Para problemas técnicos contactar al desarrollador.
Formulario listo para producción: ✅