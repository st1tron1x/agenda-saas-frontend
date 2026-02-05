/*export const tenants = {
  default: {
    id: 'default',
    name: 'Tech Solution',
    logo:{ 
        src:'/tech SVJ.png',
        width: 400,
        aspectRatio: 1,
    },
    primaryColor: '#1F611F',
    gradient: 'linear-gradient(135deg, #1F611F, #C4B5FD)',
  },

  xiomy: {
    id: 'xiomy',
    name: 'Xiomi Esthetic',
    logo: {
      src: '/Xiomy.png',
      width: 240,
      aspectRatio: 1,
    },
    primaryColor: '#E879F9',
    gradient: 'linear-gradient(135deg, #E879F9, #FBCFE8)',
  },

  go: {
    id: 'go',
    name: 'Gloria Osorio Studio',
    logo: {
        src: '/GO STUDIO.png',
        width: 240,
        aspectRatio:1,
    },
    primaryColor: '#38BDF8',
    gradient: 'linear-gradient(135deg, #38BDF8, #BAE6FD)',
  },
}*/
// src/tenants/tenant.config.js

/**
 * ==========================================
 * CONFIGURACIÓN DE TENANTS - MOCK
 * ==========================================
 * 
 * Este archivo contiene datos mock de tenants para desarrollo.
 * En producción, estos datos vendrán de PostgreSQL.
 * 
 * Cada tenant representa una instancia independiente de la aplicación
 * con su propio branding, usuarios, y datos.
 */

export const tenants = {
  default: {
    id: 'default',
    name: 'Tech Solution',
    subdomain: 'app', // app.tudominio.com
    plan: 'Trial',
    active: false,
    logo: { 
      src: '/tech SVJ.png',
      width: 400,
      aspectRatio: 1,
    },
    primaryColor: '#1F611F',
    secondaryColor: '#C4B5FD',
    gradient: 'linear-gradient(135deg, #1F611F, #C4B5FD)',
    // Metadata adicional
    description: 'Tenant por defecto del sistema',
    maxUsers: 5,
    features: ['basic'],
  },

  xiomy: {
    id: 'xiomy',
    name: 'Xiomy Esthetic',
    subdomain: 'xiomy', // xiomy.tudominio.com
    plan: 'Pro',
    active: true,
    logo: {
      src: '/Xiomy.png',
      width: 240,
      aspectRatio: 1,
    },
    primaryColor: '#E879F9',
    secondaryColor: '#FBCFE8',
    gradient: 'linear-gradient(135deg, #E879F9, #FBCFE8)',
    // Metadata adicional
    description: 'Centro de estética y belleza',
    maxUsers: 20,
    features: ['appointments', 'clients', 'services', 'staff'],
    contact: {
      email: 'info@xiomy.com',
      phone: '+57 300 123 4567',
    },
  },

  go: {
    id: 'go',
    name: 'Gloria Osorio Studio',
    subdomain: 'go', // go.tudominio.com
    plan: 'Pro Plus',
    active: true,
    logo: {
      src: '/GO STUDIO.png',
      width: 240,
      aspectRatio: 1,
    },
    primaryColor: '#38BDF8',
    secondaryColor: '#BAE6FD',
    gradient: 'linear-gradient(135deg, #38BDF8, #BAE6FD)',
    // Metadata adicional
    description: 'Estudio de belleza profesional',
    maxUsers: 50,
    features: ['appointments', 'clients', 'services', 'staff', 'inventory', 'reports'],
    contact: {
      email: 'contacto@gostudio.com',
      phone: '+57 301 987 6543',
    },
  },
}

/**
 * Helper para obtener tenant por subdominio
 * @param {string} subdomain
 * @returns {Object|null}
 */
export function getTenantBySubdomain(subdomain) {
  return Object.values(tenants).find(t => t.subdomain === subdomain) || null
}

/**
 * Helper para validar si un tenant está activo
 * @param {string} tenantId
 * @returns {boolean}
 */
export function isTenantActive(tenantId) {
  return tenants[tenantId]?.active || false
}

/**
 * Planes disponibles (mock)
 * En producción vendrá de la tabla 'plans' en PostgreSQL
 */
export const PLANS = {
  TRIAL: {
    id: 'trial',
    name: 'Trial',
    price: 0,
    maxUsers: 5,
    features: ['basic'],
    duration: 30, // días
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    maxUsers: 20,
    features: ['appointments', 'clients', 'services', 'staff'],
    duration: 30,
  },
  PRO_PLUS: {
    id: 'pro_plus',
    name: 'Pro Plus',
    price: 49.99,
    maxUsers: 50,
    features: ['appointments', 'clients', 'services', 'staff', 'inventory', 'reports', 'analytics'],
    duration: 30,
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    maxUsers: -1, // ilimitado
    features: ['all'],
    duration: 30,
  },
}