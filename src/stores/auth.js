/*import { reactive, watch } from 'vue'

const savedAuth = JSON.parse(localStorage.getItem('auth'))

const state = reactive({
  isAuthenticated: savedAuth?.isAuthenticated || false,
  user: savedAuth?.user || null,
})

export function useAuth() {
  function login(userData) {
    state.isAuthenticated = true
    state.user = userData
  }

  function logout() {
    state.isAuthenticated = false
    state.user = null
    localStorage.removeItem('auth')
  }

  // Persistencia automática
  watch(
    () => state,
    () => {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        })
      )
    },
    { deep: true }
  )

  return {
    state,
    login,
    logout,
  }
}*/
// src/stores/auth.js
import { reactive, computed, watch } from 'vue'
import { ROLES } from '../constants/roles'
import { ROLE_PERMISSIONS } from '@/config/role.permissions'

// Recuperar estado persistido
const savedAuth = JSON.parse(localStorage.getItem('auth') || 'null')

// Estado reactivo centralizado
const state = reactive({
  isAuthenticated: savedAuth?.isAuthenticated || false,
  user: savedAuth?.user || null,
})

// Computeds derivados
const role = computed(() => state.user?.role || null)
const isSuperAdmin = computed(() => state.user?.role === ROLES.SUPER_ADMIN)
const isTenantAdmin = computed(() => state.user?.role === ROLES.TENANT_ADMIN)
const isStaff = computed(() => state.user?.role === ROLES.STAFF)

/**
 * Composable de autenticación centralizado
 * 
 * MOCK - En producción conectará con backend
 */
export function useAuth() {
  /**
   * Login de usuario
   * @param {Object} userData - { id, name, email, role, tenantId }
   */
  function login(userData) {
    state.isAuthenticated = true
    state.user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      tenantId: userData.tenantId || null,
    }
  }

  /**
   * Logout de usuario
   */
  function logout() {
    state.isAuthenticated = false
    state.user = null
    localStorage.removeItem('auth')
  }

  /**
   * Actualizar datos del usuario actual
   * @param {Object} updates - Campos a actualizar
   */
  function updateUser(updates) {
    if (state.user) {
      state.user = { ...state.user, ...updates }
    }
  }

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} requiredRole - Rol a verificar
   * @returns {boolean}
   */
  function hasRole(requiredRole) {
    return state.user?.role === requiredRole
  }

  function hasPermission(permission) {
    if (!state.user) return false
    return ROLE_PERMISSIONS[state.user.role]?.includes(permission)
  }

  /**
   * Verificar si el usuario tiene alguno de los roles
   * @param {string[]} roles - Array de roles
   * @returns {boolean}
   */
  function hasAnyRole(roles) {
    return roles.includes(state.user?.role)
  }

  function impersonate({ tenantId, role }) {
    state.impersonation = {
      tenantId,
      role,
    }
  }

  return {
    // Estado
    state,
    
    // Computeds
    role,
    isSuperAdmin,
    isTenantAdmin,
    isStaff,
    
    // Acciones
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    hasPermission,
    impersonate,
  }
}

// Persistencia automática en localStorage
watch(
  () => state,
  (newState) => {
    if (newState.isAuthenticated) {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          isAuthenticated: newState.isAuthenticated,
          user: newState.user,
        })
      )
    } else {
      localStorage.removeItem('auth')
    }
  },
  { deep: true }
)

// Para debug en desarrollo
if (import.meta.env.DEV) {
  window.__AUTH_STATE__ = state
}