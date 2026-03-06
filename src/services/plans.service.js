/**
 * Servicio de planes (plataforma).
 * Conecta con /api/platform/plans/
 */
import { api } from './api'

/**
 * Lista planes activos.
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export async function getPlans() {
  return api.get('platform/plans')
}
