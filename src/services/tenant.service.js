/**
 * Servicio de tenants (plataforma).
 * Conecta con /api/platform/tenants/
 */
import { api } from './api'

/**
 * Lista tenants con filtros opcionales.
 * @param {{ search?: string, status?: string, plan?: number }} params
 * @returns {Promise<{ success: boolean, data?: any[], error?: string }>}
 */
export async function getTenants(params = {}) {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  if (params.plan) searchParams.set('plan', params.plan)
  const query = searchParams.toString()
  const endpoint = query ? `platform/tenants?${query}` : 'platform/tenants'
  const result = await api.get(endpoint)
  if (result.success && Array.isArray(result.data)) {
    return result
  }
  if (result.success && Array.isArray(result.data?.results)) {
    return { ...result, data: result.data.results }
  }
  return result
}

/**
 * Obtiene un tenant por id.
 * @param {number} tenantId
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function getTenantById(tenantId) {
  const result = await api.get(`platform/tenants/${tenantId}`)
  if (!result.success) throw new Error(result.error)
  return result.data
}

/**
 * Crea un tenant.
 * @param {object} payload - Datos del tenant (business_name, subdomain, plan_id, etc.)
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function createTenant(payload) {
  return api.post('platform/tenants', payload)
}

/**
 * Actualiza un tenant.
 * @param {number} tenantId
 * @param {object} payload
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function updateTenant(tenantId, payload) {
  return api.put(`platform/tenants/${tenantId}`, payload)
}

/**
 * Suspende un tenant.
 * @param {number} tenantId
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function suspendTenant(tenantId) {
  return api.post(`platform/tenants/${tenantId}/suspend`)
}

/**
 * Activa un tenant.
 * @param {number} tenantId
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function activateTenant(tenantId) {
  return api.post(`platform/tenants/${tenantId}/activate`)
}

/**
 * Elimina un tenant.
 * @param {number} tenantId
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteTenant(tenantId) {
  return api.delete(`platform/tenants/${tenantId}`)
}
