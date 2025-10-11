import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Formulario de Representación - COOPECOBANA',
  description: 'Formulario para registro de participación en la Asamblea General de COOPECOBANA',
  keywords: 'COOPECOBANA, Asamblea General, Representación, Formulario',
  authors: [{ name: 'Equipo de Tecnología COOPECOBANA' }],
  robots: 'noindex, nofollow', // No indexar en buscadores
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#22a06b',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full bg-gray-50">
          {/* Header */}
          <header className="bg-white border-b-4 border-coopecobana-500 shadow-lg">
            <div className="container py-6">
              <div className="flex items-center justify-center space-x-6">
                <Image
                  src="/Logo.png"
                  alt="COOPECOBANA Logo"
                  width={80}
                  height={80}
                  className="h-16 w-auto object-contain"
                  priority
                />
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-coopecobana-800">
                    COOPECOBANA R.L.
                  </h1>
                  <p className="text-lg md:text-xl text-coopecobana-600 font-medium">
                    Formulario de Representación
                  </p>
                  <p className="text-sm text-gray-600">
                    Asamblea General
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
            <div className="container py-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Image
                    src="/Logo.png"
                    alt="COOPECOBANA Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                  <p className="text-sm font-medium text-gray-700">
                    © 2025 COOPECOBANA R.L. - Todos los derechos reservados
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Cooperativa de Consumo de los Empleados del Banco Nacional
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}