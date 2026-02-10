// src/services/auth.service.js
import { api } from './api'

/**
 * Servicio de autenticación
 * Integra con el backend Django/FastAPI
 */
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
    
    if (response.success) {
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      }
    }
    
    return {
      success: false,
      error: response.error,
    }
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