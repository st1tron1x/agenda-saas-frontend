// src/composables/usePermissions.js
import { ref, computed } from 'vue'
import {
  PERMISSIONS_TREE,
  ROLE_PRESETS,
  PERMISSION_ACTIONS,
  getAllPermissionsFlat,
  hasPermission as checkPermission,
  getRolePresetPermissions,
} from '@/config/permissions.config'

/**
 * Composable para gestión de permisos
 * Maneja lógica de permisos jerárquicos, presets y validación
 */
export function usePermissions() {
  // Estado local de permisos
  const userPermissions = ref({})
  const selectedPreset = ref('custom')
  
  /**
   * Inicializar permisos desde un preset o configuración personalizada
   */
  function initializePermissions(permissions, preset = 'custom') {
    selectedPreset.value = preset
    
    if (permissions === 'ALL') {
      userPermissions.value = 'ALL'
    } else {
      userPermissions.value = { ...permissions }
    }
  }
  
  /**
   * Aplicar un preset de rol
   */
  function applyRolePreset(roleName) {
    const presetPermissions = getRolePresetPermissions(roleName)
    selectedPreset.value = roleName
    userPermissions.value = presetPermissions
  }
  
  /**
   * Toggle de un permiso específico
   */
  function togglePermission(moduleId, action) {
    if (userPermissions.value === 'ALL') {
      // Si es ALL, convertir a objeto y remover este permiso
      userPermissions.value = {}
      const allFlat = getAllPermissionsFlat()
      allFlat.forEach(perm => {
        const key = perm.id.replace('.', '_')
        userPermissions.value[key] = true
      })
    }
    
    const permKey = `${moduleId}.${action}`.replace('.', '_')
    
    if (userPermissions.value[permKey]) {
      delete userPermissions.value[permKey]
    } else {
      userPermissions.value[permKey] = true
    }
    
    // Marcar como personalizado si se modifica
    if (selectedPreset.value !== 'custom') {
      selectedPreset.value = 'custom'
    }
  }
  
  /**
   * Toggle de todos los permisos de un módulo
   */
  function toggleModule(moduleId, enable = true) {
    const module = PERMISSIONS_TREE[moduleId]
    if (!module) return
    
    // Toggle permisos del padre
    module.actions.forEach(action => {
      const permKey = `${moduleId}.${action}`.replace('.', '_')
      if (enable) {
        userPermissions.value[permKey] = true
      } else {
        delete userPermissions.value[permKey]
      }
    })
    
    // Toggle permisos de los hijos
    if (module.children) {
      Object.keys(module.children).forEach(childId => {
        const child = module.children[childId]
        child.actions.forEach(action => {
          const permKey = `${childId}.${action}`.replace('.', '_')
          if (enable) {
            userPermissions.value[permKey] = true
          } else {
            delete userPermissions.value[permKey]
          }
        })
      })
    }
    
    // Marcar como personalizado
    if (selectedPreset.value !== 'custom') {
      selectedPreset.value = 'custom'
    }
  }
  
  /**
   * Verificar si un permiso está activo
   */
  function hasPermission(permissionKey) {
    if (userPermissions.value === 'ALL') return true
    
    const normalizedKey = permissionKey.replace('.', '_')
    return userPermissions.value[normalizedKey] === true
  }
  
  /**
   * Verificar si un módulo completo está activo
   */
  function hasModulePermission(moduleId) {
    if (userPermissions.value === 'ALL') return true
    
    const module = PERMISSIONS_TREE[moduleId]
    if (!module) return false
    
    // Verificar si al menos un permiso del módulo está activo
    return module.actions.some(action => {
      const permKey = `${moduleId}.${action}`.replace('.', '_')
      return userPermissions.value[permKey] === true
    })
  }
  
  /**
   * Obtener permisos activos de un módulo
   */
  function getModuleActivePermissions(moduleId) {
    if (userPermissions.value === 'ALL') {
      const module = PERMISSIONS_TREE[moduleId]
      return module ? module.actions : []
    }
    
    const module = PERMISSIONS_TREE[moduleId]
    if (!module) return []
    
    return module.actions.filter(action => {
      const permKey = `${moduleId}.${action}`.replace('.', '_')
      return userPermissions.value[permKey] === true
    })
  }
  
  /**
   * Obtener estadísticas de permisos
   */
  const permissionStats = computed(() => {
    if (userPermissions.value === 'ALL') {
      const total = getAllPermissionsFlat().length
      return {
        total,
        active: total,
        percentage: 100,
      }
    }
    
    const allPerms = getAllPermissionsFlat()
    const activeCount = allPerms.filter(perm => {
      const key = perm.id.replace('.', '_')
      return userPermissions.value[key] === true
    }).length
    
    return {
      total: allPerms.length,
      active: activeCount,
      percentage: Math.round((activeCount / allPerms.length) * 100),
    }
  })
  
  /**
   * Obtener resumen de permisos por módulo
   */
  const permissionsSummary = computed(() => {
    const summary = []
    
    Object.values(PERMISSIONS_TREE).forEach(module => {
      const activePerms = getModuleActivePermissions(module.id)
      
      summary.push({
        id: module.id,
        label: module.label,
        icon: module.icon,
        color: module.color,
        total: module.actions.length,
        active: activePerms.length,
        isActive: activePerms.length > 0,
        isFullyActive: activePerms.length === module.actions.length,
      })
    })
    
    return summary
  })
  
  /**
   * Comparar permisos actuales con un preset
   */
  function compareWithPreset(presetName) {
    const presetPerms = getRolePresetPermissions(presetName)
    
    if (presetPerms === 'ALL') {
      return userPermissions.value === 'ALL'
    }
    
    if (userPermissions.value === 'ALL') {
      return false
    }
    
    // Comparar cada permiso
    const allPerms = getAllPermissionsFlat()
    return allPerms.every(perm => {
      const key = perm.id.replace('.', '_')
      const currentHas = userPermissions.value[key] === true
      const presetHas = presetPerms[key] === true
      return currentHas === presetHas
    })
  }
  
  /**
   * Detectar preset actual
   */
  const detectedPreset = computed(() => {
    // Verificar si coincide con algún preset
    for (const [presetName, preset] of Object.entries(ROLE_PRESETS)) {
      if (compareWithPreset(presetName)) {
        return presetName
      }
    }
    return 'custom'
  })
  
  /**
   * Exportar permisos en formato para API
   */
  function exportPermissions() {
    if (userPermissions.value === 'ALL') {
      return { all: true }
    }
    
    return { ...userPermissions.value }
  }
  
  /**
   * Importar permisos desde API
   */
  function importPermissions(permissions) {
    if (permissions.all === true) {
      userPermissions.value = 'ALL'
    } else {
      userPermissions.value = { ...permissions }
    }
  }
  
  /**
   * Resetear permisos
   */
  function resetPermissions() {
    userPermissions.value = {}
    selectedPreset.value = 'custom'
  }
  
  return {
    // State
    userPermissions,
    selectedPreset,
    
    // Computed
    permissionStats,
    permissionsSummary,
    detectedPreset,
    
    // Methods
    initializePermissions,
    applyRolePreset,
    togglePermission,
    toggleModule,
    hasPermission,
    hasModulePermission,
    getModuleActivePermissions,
    compareWithPreset,
    exportPermissions,
    importPermissions,
    resetPermissions,
    
    // Config exports
    PERMISSIONS_TREE,
    ROLE_PRESETS,
    PERMISSION_ACTIONS,
  }
}