/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para hosting tradicional
  output: 'export',
  
  // Configuración de imágenes
  images: {
    domains: [],
    unoptimized: true, // Para hosting compartido
  },
  
  // Configuración de archivos estáticos
  trailingSlash: false,
  
  // Variables de entorno públicas
  env: {
    TZ: process.env.TZ || 'America/Costa_Rica',
  },'next').NextConfig} */
const nextConfig = {
  // Configuración para BanaHosting (shared hosting)
  output: 'export',
  
  // Configuración de imágenes
  images: {
    domains: [],
    unoptimized: true, // Para hosting compartido
  },
  
  // Configuración de archivos estáticos
  trailingSlash: false,
  
  // Variables de entorno públicas
  env: {
    TZ: process.env.TZ || 'America/Costa_Rica',
  },
  
  // Configuración experimental para App Router
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb', // Para archivos adjuntos
    },
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;