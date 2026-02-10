// src/config/permissions.config.js
/**
 * Sistema de Permisos Jerárquico (Padre-Hijo)
 * Define todos los permisos disponibles en el sistema
 */

export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  INACTIVATE: 'inactivate',
}

export const PERMISSION_ACTION_LABELS = {
  view: 'Ver',
  create: 'Crear',
  edit: 'Editar',
  delete: 'Eliminar',
  inactivate: 'Inactivar',
}

/**
 * Árbol de permisos con estructura padre-hijo
 * Cada módulo puede tener sub-permisos (children)
 */
export const PERMISSIONS_TREE = {
  // ==================== CITAS Y AGENDA ====================
  appointments: {
    id: 'appointments',
    label: 'Gestión de Citas',
    description: 'Control total sobre el calendario y las citas',
    icon: 'mdi-calendar',
    color: 'primary',
    actions: ['view', 'create', 'edit', 'delete', 'inactivate'],
    
    children: {
      appointment_photos: {
        id: 'appointment_photos',
        label: 'Fotos de Procedimientos',
        description: 'Gestionar fotos antes/después de procedimientos',
        parent: 'appointments',
        icon: 'mdi-camera',
        actions: ['view', 'create', 'delete'],
      },
      appointment_notes: {
        id: 'appointment_notes',
        label: 'Notas de Citas',
        description: 'Agregar y editar notas en las citas',
        parent: 'appointments',
        icon: 'mdi-note-text',
        actions: ['view', 'create', 'edit', 'delete'],
      },
      appointment_reminders: {
        id: 'appointment_reminders',
        label: 'Recordatorios',
        description: 'Configurar recordatorios automáticos',
        parent: 'appointments',
        icon: 'mdi-bell',
        actions: ['view', 'create', 'edit'],
      },
    },
  },

  // ==================== CLIENTES ====================
  clients: {
    id: 'clients',
    label: 'Gestión de Clientes',
    description: 'Administrar base de datos de clientes',
    icon: 'mdi-account-group',
    color: 'success',
    actions: ['view', 'create', 'edit', 'delete', 'inactivate'],
    
    children: {
      client_history: {
        id: 'client_history',
        label: 'Historial Clínico',
        description: 'Ver y editar historial médico del cliente',
        parent: 'clients',
        icon: 'mdi-history',
        actions: ['view', 'create', 'edit'],
      },
      client_documents: {
        id: 'client_documents',
        label: 'Documentos del Cliente',
        description: 'Gestionar documentos (consentimientos, recetas)',
        parent: 'clients',
        icon: 'mdi-file-document',
        actions: ['view', 'create', 'delete'],
      },
      client_notes: {
        id: 'client_notes',
        label: 'Notas del Cliente',
        description: 'Notas privadas sobre el cliente',
        parent: 'clients',
        icon: 'mdi-note-multiple',
        actions: ['view', 'create', 'edit', 'delete'],
      },
      client_export: {
        id: 'client_export',
        label: 'Exportar Datos',
        description: 'Exportar información de clientes',
        parent: 'clients',
        icon: 'mdi-download',
        actions: ['view'],
      },
    },
  },

  // ==================== SERVICIOS ====================
  services: {
    id: 'services',
    label: 'Catálogo de Servicios',
    description: 'Gestionar servicios ofrecidos',
    icon: 'mdi-clipboard-list',
    color: 'info',
    actions: ['view', 'create', 'edit', 'delete', 'inactivate'],
    
    children: {
      service_pricing: {
        id: 'service_pricing',
        label: 'Precios de Servicios',
        description: 'Modificar precios de servicios',
        parent: 'services',
        icon: 'mdi-currency-usd',
        actions: ['view', 'edit'],
      },
      service_categories: {
        id: 'service_categories',
        label: 'Categorías',
        description: 'Organizar servicios en categorías',
        parent: 'services',
        icon: 'mdi-folder',
        actions: ['view', 'create', 'edit', 'delete'],
      },
    },
  },

  // ==================== USUARIOS Y STAFF ====================
  users: {
    id: 'users',
    label: 'Gestión de Usuarios',
    description: 'Administrar usuarios del sistema',
    icon: 'mdi-account-cog',
    color: 'warning',
    actions: ['view', 'create', 'edit', 'delete', 'inactivate'],
    
    children: {
      user_permissions: {
        id: 'user_permissions',
        label: 'Permisos de Usuarios',
        description: 'Asignar y modificar permisos',
        parent: 'users',
        icon: 'mdi-shield-lock',
        actions: ['view', 'edit'],
      },
      user_roles: {
        id: 'user_roles',
        label: 'Roles de Usuarios',
        description: 'Gestionar roles predefinidos',
        parent: 'users',
        icon: 'mdi-account-group',
        actions: ['view', 'create', 'edit', 'delete'],
      },
    },
  },

  // ==================== REPORTES Y ANALÍTICAS ====================
  reports: {
    id: 'reports',
    label: 'Reportes y Analíticas',
    description: 'Acceder a reportes del negocio',
    icon: 'mdi-chart-bar',
    color: 'purple',
    actions: ['view'],
    
    children: {
      reports_revenue: {
        id: 'reports_revenue',
        label: 'Reporte de Ingresos',
        description: 'Ver ingresos y facturación',
        parent: 'reports',
        icon: 'mdi-cash',
        actions: ['view'],
      },
      reports_appointments: {
        id: 'reports_appointments',
        label: 'Reporte de Citas',
        description: 'Estadísticas de citas',
        parent: 'reports',
        icon: 'mdi-calendar-clock',
        actions: ['view'],
      },
      reports_staff: {
        id: 'reports_staff',
        label: 'Desempeño del Staff',
        description: 'Métricas de rendimiento del equipo',
        parent: 'reports',
        icon: 'mdi-account-star',
        actions: ['view'],
      },
      reports_export: {
        id: 'reports_export',
        label: 'Exportar Reportes',
        description: 'Descargar reportes en Excel/PDF',
        parent: 'reports',
        icon: 'mdi-file-export',
        actions: ['view'],
      },
    },
  },

  // ==================== CONFIGURACIÓN ====================
  settings: {
    id: 'settings',
    label: 'Configuración',
    description: 'Configurar el sistema',
    icon: 'mdi-cog',
    color: 'grey',
    actions: ['view', 'edit'],
    
    children: {
      settings_business: {
        id: 'settings_business',
        label: 'Información del Negocio',
        description: 'Editar nombre, logo, dirección',
        parent: 'settings',
        icon: 'mdi-store',
        actions: ['view', 'edit'],
      },
      settings_schedule: {
        id: 'settings_schedule',
        label: 'Horarios de Atención',
        description: 'Configurar horarios del negocio',
        parent: 'settings',
        icon: 'mdi-clock',
        actions: ['view', 'edit'],
      },
      settings_notifications: {
        id: 'settings_notifications',
        label: 'Notificaciones',
        description: 'Configurar emails y recordatorios',
        parent: 'settings',
        icon: 'mdi-bell-cog',
        actions: ['view', 'edit'],
      },
      settings_billing: {
        id: 'settings_billing',
        label: 'Facturación',
        description: 'Gestionar plan y facturación',
        parent: 'settings',
        icon: 'mdi-credit-card',
        actions: ['view', 'edit'],
      },
      settings_integrations: {
        id: 'settings_integrations',
        label: 'Integraciones',
        description: 'Google Calendar, WhatsApp, etc.',
        parent: 'settings',
        icon: 'mdi-puzzle',
        actions: ['view', 'edit'],
      },
    },
  },

  // ==================== INVENTARIO (Opcional) ====================
  inventory: {
    id: 'inventory',
    label: 'Inventario',
    description: 'Gestionar productos e insumos',
    icon: 'mdi-package-variant',
    color: 'teal',
    actions: ['view', 'create', 'edit', 'delete'],
    
    children: {
      inventory_stock: {
        id: 'inventory_stock',
        label: 'Control de Stock',
        description: 'Actualizar niveles de inventario',
        parent: 'inventory',
        icon: 'mdi-warehouse',
        actions: ['view', 'edit'],
      },
      inventory_orders: {
        id: 'inventory_orders',
        label: 'Órdenes de Compra',
        description: 'Gestionar pedidos de productos',
        parent: 'inventory',
        icon: 'mdi-cart',
        actions: ['view', 'create', 'edit'],
      },
    },
  },

  // ==================== FINANZAS ====================
  finances: {
    id: 'finances',
    label: 'Finanzas',
    description: 'Gestión financiera',
    icon: 'mdi-cash-multiple',
    color: 'green',
    actions: ['view', 'create', 'edit'],
    
    children: {
      finances_payments: {
        id: 'finances_payments',
        label: 'Pagos',
        description: 'Registrar pagos de clientes',
        parent: 'finances',
        icon: 'mdi-cash-register',
        actions: ['view', 'create', 'edit'],
      },
      finances_expenses: {
        id: 'finances_expenses',
        label: 'Gastos',
        description: 'Registrar gastos del negocio',
        parent: 'finances',
        icon: 'mdi-receipt',
        actions: ['view', 'create', 'edit', 'delete'],
      },
      finances_commissions: {
        id: 'finances_commissions',
        label: 'Comisiones del Staff',
        description: 'Calcular comisiones',
        parent: 'finances',
        icon: 'mdi-percent',
        actions: ['view', 'edit'],
      },
    },
  },
}

/**
 * Presets de permisos por rol
 */
export const ROLE_PRESETS = {
  admin: {
    label: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades',
    color: 'error',
    permissions: 'ALL', // Indica que tiene TODOS los permisos
  },

  manager: {
    label: 'Gerente',
    description: 'Gestión completa excepto configuración crítica',
    color: 'warning',
    permissions: {
      appointments: ['view', 'create', 'edit', 'delete', 'inactivate'],
      appointment_photos: ['view', 'create', 'delete'],
      appointment_notes: ['view', 'create', 'edit', 'delete'],
      appointment_reminders: ['view', 'create', 'edit'],
      clients: ['view', 'create', 'edit', 'delete', 'inactivate'],
      client_history: ['view', 'create', 'edit'],
      client_documents: ['view', 'create', 'delete'],
      client_notes: ['view', 'create', 'edit', 'delete'],
      client_export: ['view'],
      services: ['view', 'create', 'edit', 'delete', 'inactivate'],
      service_pricing: ['view', 'edit'],
      service_categories: ['view', 'create', 'edit', 'delete'],
      users: ['view', 'create', 'edit', 'inactivate'],
      user_permissions: ['view', 'edit'],
      reports: ['view'],
      reports_revenue: ['view'],
      reports_appointments: ['view'],
      reports_staff: ['view'],
      reports_export: ['view'],
      settings: ['view', 'edit'],
      settings_business: ['view', 'edit'],
      settings_schedule: ['view', 'edit'],
      settings_notifications: ['view', 'edit'],
      inventory: ['view', 'create', 'edit', 'delete'],
      inventory_stock: ['view', 'edit'],
      inventory_orders: ['view', 'create', 'edit'],
      finances: ['view', 'create', 'edit'],
      finances_payments: ['view', 'create', 'edit'],
      finances_expenses: ['view', 'create', 'edit', 'delete'],
      finances_commissions: ['view', 'edit'],
    },
  },

  staff: {
    label: 'Personal',
    description: 'Permisos básicos para atención de clientes',
    color: 'success',
    permissions: {
      appointments: ['view', 'create', 'edit'],
      appointment_photos: ['view', 'create'],
      appointment_notes: ['view', 'create', 'edit'],
      clients: ['view', 'create', 'edit'],
      client_history: ['view', 'create'],
      client_documents: ['view', 'create'],
      client_notes: ['view', 'create'],
      services: ['view'],
      reports: ['view'], // Solo sus propias métricas
      reports_staff: ['view'], // Solo sus propias comisiones
      settings: ['view'],
      inventory: ['view'],
      inventory_stock: ['view'],
    },
  },

  receptionist: {
    label: 'Recepcionista',
    description: 'Gestión de citas y clientes básicos',
    color: 'info',
    permissions: {
      appointments: ['view', 'create', 'edit', 'delete'],
      appointment_notes: ['view', 'create'],
      clients: ['view', 'create', 'edit'],
      client_documents: ['view', 'create'],
      services: ['view'],
      settings: ['view'],
    },
  },

  custom: {
    label: 'Personalizado',
    description: 'Permisos configurados manualmente',
    color: 'purple',
    permissions: {}, // Vacío - se configura manualmente
  },
}

/**
 * Obtener todos los permisos como lista plana
 */
export function getAllPermissionsFlat() {
  const flat = []
  
  Object.values(PERMISSIONS_TREE).forEach(module => {
    // Permisos del módulo padre
    module.actions.forEach(action => {
      flat.push({
        id: `${module.id}.${action}`,
        module: module.id,
        moduleLabel: module.label,
        action: action,
        actionLabel: PERMISSION_ACTION_LABELS[action],
        isChild: false,
      })
    })
    
    // Permisos de los hijos
    if (module.children) {
      Object.values(module.children).forEach(child => {
        child.actions.forEach(action => {
          flat.push({
            id: `${child.id}.${action}`,
            module: child.id,
            moduleLabel: child.label,
            parentModule: module.id,
            parentModuleLabel: module.label,
            action: action,
            actionLabel: PERMISSION_ACTION_LABELS[action],
            isChild: true,
          })
        })
      })
    }
  })
  
  return flat
}

/**
 * Validar si un usuario tiene un permiso específico
 */
export function hasPermission(userPermissions, permissionKey) {
  if (!userPermissions) return false
  if (userPermissions === 'ALL') return true
  
  return userPermissions[permissionKey] === true ||
         (Array.isArray(userPermissions[permissionKey]) && userPermissions[permissionKey].length > 0)
}

/**
 * Obtener permisos de un preset de rol
 */
export function getRolePresetPermissions(roleName) {
  const preset = ROLE_PRESETS[roleName]
  if (!preset) return {}
  if (preset.permissions === 'ALL') return 'ALL'
  return { ...preset.permissions }
}