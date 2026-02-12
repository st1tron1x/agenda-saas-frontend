import { tenants } from '@/tenants/tenant.config'

const estimatedPlanMrr = {
  Trial: 0,
  Pro: 49,
  'Pro Plus': 99,
}

export function getTenants() {
  // MOCK – luego será fetch a API
  return Promise.resolve(
    Object.values(tenants).map((tenant, index) => {
      const plan = tenant.plan ?? 'Pro'

      return {
        id: tenant.id,
        name: tenant.name,
        plan,
        active: tenant.active ?? true,
        logo: tenant.logo,
        subdomain: tenant.subdomain || `${tenant.id}-tenant`,
        usersCount: tenant.usersCount || 3 + index,
        mrr: estimatedPlanMrr[plan] ?? 0,
      }
    })
  )
}
