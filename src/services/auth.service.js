// src/services/auth.service.js
import { api } from './api'

function normalizeLoginResponse(data = {}) {
  console.log('📦 Normalizando respuesta de login:', data)
  
  const user = data.user
  const accessToken = data.access_token || data.token || null
  const refreshToken = data.refresh_token || null

  if (!user || !accessToken) {
    console.error('❌ Respuesta incompleta del backend:', { user, accessToken })
    return {
      success: false,
      error: 'El backend respondió 200, pero no devolvió user + access_token.',
    }
  }

  const normalized = {
    success: true,
    user: {
      ...user,
      tenantId: user.tenant_id ?? user.tenantId ?? null,
    },
    token: accessToken,
    refreshToken,
  }
  
  console.log('✅ Respuesta normalizada:', normalized)
  return normalized
}

export const authService = {
  /**
   * Login de usuario
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    console.log('🔐 authService.login iniciado:', email)
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })
      
      console.log('📡 Respuesta del servidor:', response)
      
      if (!response.success) {
        console.error('❌ Login fallido:', response.error)
        return {
          success: false,
          error: response.error || 'No se pudo iniciar sesión', 
        }
      }

      return normalizeLoginResponse(response.data)
    } catch (error) {
      console.error('❌ Error en authService.login:', error)
      throw error
    }
  },

  /**
   * Logout de usuario
   * @returns {Promise<void>}
   */
  async logout() {
    console.log('🚪 authService.logout iniciado')
    
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken) {
        await api.post('/auth/logout', {
          refresh_token: refreshToken
        })
      }
      
      console.log('✅ Logout exitoso')
    } catch (error) {
      console.error('⚠️ Error en logout (se ignora):', error)
      // Ignorar errores de logout
    } finally {
      // Limpiar tokens siempre
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth')
    }
  },

  /**
   * Obtener usuario actual
   * @returns {Promise<Object>}
   */
  async me() {
    console.log('👤 authService.me iniciado')
    
    try {
      const response = await api.get('/auth/me')
      
      if (response.success) {
        console.log('✅ Usuario obtenido:', response.data)
        return {
          success: true,
          user: response.data.user,
        }
      }
      
      console.error('❌ Error obteniendo usuario:', response.error)
      return {
        success: false,
        error: response.error,
      }
    } catch (error) {
      console.error('❌ Error en authService.me:', error)
      return {
        success: false,
        error: error.message || 'Error al obtener usuario',
      }
    }
  },

  /**
   * Recuperar contraseña
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    console.log('🔑 authService.forgotPassword:', email)
    
    try {
      const response = await api.post('/auth/forgot-password', { email })
      console.log('📧 Respuesta forgot-password:', response)
      return response
    } catch (error) {
      console.error('❌ Error en forgotPassword:', error)
      throw error
    }
  },

  /**
   * Resetear contraseña
   * @param {string} token
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async resetPassword(token, password) {
    console.log('🔐 authService.resetPassword iniciado')
    
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password,
      })
      console.log('✅ Password reseteado:', response)
      return response
    } catch (error) {
      console.error('❌ Error en resetPassword:', error)
      throw error
    }
  },

  /**
   * Refrescar token
   * @param {string} refreshToken
   * @returns {Promise<Object>}
   */
  async refreshToken(refreshToken) {
    console.log('🔄 authService.refreshToken iniciado')
    
    try {
      const response = await api.post('/auth/refresh', {
        refresh: refreshToken  // ⭐ Django usa "refresh", no "refresh_token"
      })
      
      console.log('✅ Token refrescado:', response)
      
      if (response.success && response.data.access) {
        // Guardar nuevo access token
        localStorage.setItem('access_token', response.data.access)
        
        return {
          success: true,
          token: response.data.access
        }
      }
      
      return {
        success: false,
        error: 'No se pudo refrescar el token'
      }
    } catch (error) {
      console.error('❌ Error en refreshToken:', error)
      
      // Si falla el refresh, limpiar todo
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth')
      
      throw error
    }
  },
}