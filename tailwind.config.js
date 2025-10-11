/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores corporativos de COOPECOBANA basados en el logo
        coopecobana: {
          50: '#f0f9f4',   // Verde muy claro
          100: '#dcf4e6',  // Verde claro
          200: '#bbead0',  // Verde suave
          300: '#86d8b5',  // Verde medio
          400: '#4fc094',  // Verde principal
          500: '#22a06b',  // Verde corporativo principal
          600: '#1a8355',  // Verde oscuro
          700: '#166b46',  // Verde muy oscuro
          800: '#155539',  // Verde profundo
          900: '#124530',  // Verde más profundo
          950: '#0a251a',  // Verde casi negro
        },
        // Azul complementario (típico de cooperativas)
        cooperativa: {
          50: '#eff8ff',   // Azul muy claro
          100: '#dbeffe',  // Azul claro
          200: '#bfe3fd',  // Azul suave
          300: '#93d2fc',  // Azul medio
          400: '#60b7f8',  // Azul principal
          500: '#3b9df4',  // Azul corporativo
          600: '#2582e9',  // Azul fuerte
          700: '#1d6dd6',  // Azul oscuro
          800: '#1e58ae',  // Azul muy oscuro
          900: '#1e4d89',  // Azul profundo
          950: '#173154',  // Azul casi negro
        },
        // Dorado/Amarillo (accent para destacar)
        accent: {
          50: '#fffbeb',   // Dorado muy claro
          100: '#fef3c7',  // Dorado claro
          200: '#fde68a',  // Dorado suave
          300: '#fcd34d',  // Dorado medio
          400: '#fbbf24',  // Dorado principal
          500: '#f59e0b',  // Dorado corporativo
          600: '#d97706',  // Dorado fuerte
          700: '#b45309',  // Dorado oscuro
          800: '#92400e',  // Dorado muy oscuro
          900: '#78350f',  // Dorado profundo
          950: '#451a03',  // Dorado casi negro
        },
        // Mantenemos algunos colores originales para compatibilidad
        primary: {
          50: '#f0f9f4',
          100: '#dcf4e6',
          200: '#bbead0',
          300: '#86d8b5',
          400: '#4fc094',
          500: '#22a06b',  // Verde principal de COOPECOBANA
          600: '#1a8355',
          700: '#166b46',
          800: '#155539',
          900: '#124530',
        },
        secondary: {
          50: '#eff8ff',
          100: '#dbeffe',
          200: '#bfe3fd',
          300: '#93d2fc',
          400: '#60b7f8',
          500: '#3b9df4',  // Azul secundario
          600: '#2582e9',
          700: '#1d6dd6',
          800: '#1e58ae',
          900: '#1e4d89',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}