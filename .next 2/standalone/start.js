#!/usr/bin/env node

// Script de inicio para COOPECOBANA
const path = require('path');

// Configurar variables de entorno para producción
process.env.NODE_ENV = 'production';

// Puerto por defecto o el que asigne Banahostin
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

console.log('🚀 Iniciando servidor COOPECOBANA...');
console.log(`📡 Servidor corriendo en: ${HOSTNAME}:${PORT}`);
console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);

// Iniciar el servidor Next.js standalone
require('./server.js');