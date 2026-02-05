//UseTenant.js
import { tenants } from '../tenants/tenant.config'

export function useTenant() {
  // MOCK: luego se detecta por subdominio
  const hostname = window.location.hostname

  let tenantKey = 'default'

  if (hostname.includes('xiomy')) tenantKey = 'xiomy'
  if (hostname.includes('go')) tenantKey = 'go'

  const tenant = tenants[tenantKey] || tenants.default

  return {
    tenant,
  }
}