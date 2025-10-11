/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para Vercel
  
  // Configuración de imágenes
  images: {
    domains: [],
    unoptimized: true, // Para compatibilidad con hosting estático
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
  
  // Headers de seguridad para Vercel
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
}

module.exports = nextConfig;