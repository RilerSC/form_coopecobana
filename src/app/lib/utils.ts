import { useState, useEffect } from 'react'
import type { FormularioEstado } from '../types'

/**
 * Hook para manejar el estado del formulario
 */
export function useFormState() {
  const [estado, setEstado] = useState<FormularioEstado>('idle')
  const [mensaje, setMensaje] = useState<string>('')
  const [error, setError] = useState<string>('')

  const resetState = () => {
    setEstado('idle')
    setMensaje('')
    setError('')
  }

  const setLoading = () => {
    setEstado('loading')
    setMensaje('')
    setError('')
  }

  const setSuccess = (message: string) => {
    setEstado('success')
    setMensaje(message)
    setError('')
  }

  const setErrorState = (errorMessage: string) => {
    setEstado('error')
    setError(errorMessage)
    setMensaje('')
  }

  return {
    estado,
    mensaje,
    error,
    isLoading: estado === 'loading',
    isSuccess: estado === 'success',
    isError: estado === 'error',
    resetState,
    setLoading,
    setSuccess,
    setError: setErrorState
  }
}

/**
 * Hook para verificar si el formulario está abierto
 */
export function useFormAvailability() {
  const [isOpen, setIsOpen] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [closeDate, setCloseDate] = useState<string>('')

  useEffect(() => {
    const checkAvailability = () => {
      const now = new Date()
      const closingDate = new Date('2025-11-06T01:00:00-06:00')
      const isFormOpen = now < closingDate

      setIsOpen(isFormOpen)
      setCloseDate(closingDate.toLocaleString('es-CR', {
        timeZone: 'America/Costa_Rica',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }))

      if (isFormOpen) {
        const diff = closingDate.getTime() - now.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (days > 0) {
          setTimeRemaining(`${days} día${days > 1 ? 's' : ''} y ${hours} hora${hours > 1 ? 's' : ''}`)
        } else if (hours > 0) {
          setTimeRemaining(`${hours} hora${hours > 1 ? 's' : ''} y ${minutes} minuto${minutes > 1 ? 's' : ''}`)
        } else {
          setTimeRemaining(`${minutes} minuto${minutes > 1 ? 's' : ''}`)
        }
      }
    }

    checkAvailability()
    const interval = setInterval(checkAvailability, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [])

  return {
    isOpen,
    timeRemaining,
    closeDate
  }
}

/**
 * Utilidad para formatear tamaños de archivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Utilidad para validar un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Utilidad para limpiar números (solo dígitos)
 */
export function cleanNumericValue(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Utilidad para formatear número de cédula (visual)
 */
export function formatCedula(cedula: string): string {
  const cleaned = cleanNumericValue(cedula)
  
  // Formato: X-XXXX-XXXX para cédulas costarricenses
  if (cleaned.length >= 9) {
    return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5, 9)}`
  }
  
  return cleaned
}

/**
 * Utilidad para formatear número de teléfono (visual)
 */
export function formatPhone(phone: string): string {
  const cleaned = cleanNumericValue(phone)
  
  // Formato: XXXX-XXXX para teléfonos costarricenses
  if (cleaned.length >= 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`
  }
  
  return cleaned
}

/**
 * Utilidad para detectar tipo de archivo por extensión
 */
export function getFileType(filename: string): 'pdf' | 'image' | 'unknown' {
  const extension = filename.toLowerCase().split('.').pop()
  
  if (extension === 'pdf') return 'pdf'
  if (['jpg', 'jpeg', 'png'].includes(extension || '')) return 'image'
  
  return 'unknown'
}

/**
 * Utilidad para generar un ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Utilidad para debounce (retrasar ejecución)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}