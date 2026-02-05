import { tenants } from '@/tenants/tenant.config'

export function getTenants() {
  // MOCK – luego será fetch a API
  return Promise.resolve(
    Object.values(tenants).map(t => ({
      id: t.id,
      name: t.name,
      plan: t.plan ?? 'Pro',
      active: t.active ?? true,
      logo: t.logo,
    }))
  )
}
