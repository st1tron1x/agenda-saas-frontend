// src/services/api.js - API Client con manejo de errores
import axios from 'axios'
import { useAuth } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Instancia de Axios configurada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requests - añadir token
apiClient.interceptors.request.use(
  (config) => {
    const { state } = useAuth()
    if (state.user?.token) {
      config.headers.Authorization = `Bearer ${state.user.token}`
    }
    
    // Si está impersonando, añadir header
    if (state.isImpersonating && state.user?.tenantId) {
      config.headers['X-Tenant-ID'] = state.user.tenantId
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de responses - manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuth()
    
    if (error.response) {
      // Errores del servidor
      switch (error.response.status) {
        case 401:
          // Token inválido o expirado
          logout()
          window.location.href = '/login'
          break
        case 403:
          // Sin permisos
          console.error('Acceso denegado')
          break
        case 404:
          console.error('Recurso no encontrado')
          break
        case 422:
          // Validación fallida
          console.error('Validación fallida:', error.response.data.errors)
          break
        case 500:
          console.error('Error del servidor')
          break
      }
    } else if (error.request) {
      // Sin respuesta del servidor
      console.error('No hay respuesta del servidor')
    } else {
      console.error('Error de configuración:', error.message)
    }
    
    return Promise.reject(error)
  }
)

/**
 * Wrapper genérico para llamadas API con manejo de errores
 */
export async function apiCall(method, endpoint, data = null, config = {}) {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data,
      ...config,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error en la solicitud',
      errors: error.response?.data?.errors || {},
    }
  }
}

// Métodos helper
export const api = {
  get: (endpoint, config) => apiCall('GET', endpoint, null, config),
  post: (endpoint, data, config) => apiCall('POST', endpoint, data, config),
  put: (endpoint, data, config) => apiCall('PUT', endpoint, data, config),
  patch: (endpoint, data, config) => apiCall('PATCH', endpoint, data, config),
  delete: (endpoint, config) => apiCall('DELETE', endpoint, null, config),
}

export default apiClient