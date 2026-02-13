// src/services/auth.service.js
import { api } from './api'

function normalizeLoginResponse(data = {}) {
  const user = data.user
  const accessToken = data.access_token || data.token || null
  const refreshToken = data.refresh_token || null

  if (!user || !accessToken) {
    return {
      success: false,
      error: 'El backend respondió 200, pero no devolvió user + access_token. Implementa el contrato de /api/auth/login.',
    }
  }

  return {
    success: true,
    user: {
      ...user,
      tenantId: user.tenant_id ?? user.tenantId ?? null,
    },
    token: accessToken,
    refreshToken,
  }
}

export const authService = {
  /**
   * Login de usuario
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    
    if (!response.success) {
      return {
          success: false,
          error: response.error || 'No se pudo iniciar sesion', 
        }
      }

      return normalizeLoginResponse(response.data)
    },
    

  /**
   * Logout de usuario
   * @returns {Promise<void>}
   */
  async logout() {
    await api.post('/auth/logout')
  },

  /**
   * Obtener usuario actual
   * @returns {Promise<Object>}
   */
  async me() {
    const response = await api.get('/auth/me')
    
    if (response.success) {
      return {
        success: true,
        user: response.data,
      }
    }
    
    return {
      success: false,
      error: response.error,
    }
  },

  /**
   * Recuperar contraseña
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email })
  },

  /**
   * Resetear contraseña
   * @param {string} token
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async resetPassword(token, password) {
    return await api.post('/auth/reset-password', {
      token,
      password,
    })
  },

  /**
   * Refrescar token
   * @param {string} refreshToken
   * @returns {Promise<Object>}
   */
  async refreshToken(refreshToken) {
    return await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    })
  },
}