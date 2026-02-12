import { tenants } from '@/tenants/tenant.config'

const estimatedPlanMrr = {
  Trial: 0,
  Pro: 49,
  'Pro Plus': 99,
}

function toTenantListItem(tenant, index = 0) {
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
}

export function getTenants() {
  // MOCK – luego será fetch a API
  return Promise.resolve(Object.values(tenants).map(toTenantListItem))
}

export function getTenantById(tenantId) {
  const tenant = Object.values(tenants).find(item => item.id === tenantId)

  if (!tenant) {
    throw new Error('Tenant no encontrado')
  }

  return Promise.resolve({
    id: tenant.id,
    business_name: tenant.name || '',
    subdomain: tenant.subdomain || '',
    owner_name: tenant.contact?.name || '',
    owner_email: tenant.contact?.email || '',
    owner_phone: tenant.contact?.phone || '',
    plan_id: tenant.plan || 'Pro',
    business_type: tenant.businessType || '',
    trial_end_date: tenant.trialEndDate || '',
    address: tenant.address || '',
    brand_colors: {
      primary: tenant.primaryColor || '#6366F1',
      secondary: tenant.secondaryColor || '#EC4899',
    },
    settings: {
      max_users: tenant.maxUsers ?? null,
      max_appointments: tenant.maxAppointments ?? null,
      custom_domain_enabled: tenant.customDomainEnabled ?? false,
      api_access_enabled: tenant.apiAccessEnabled ?? false,
    },
    active: tenant.active ?? true,
  })
}

export function updateTenant(tenantId, payload) {
  const tenantEntry = Object.entries(tenants).find(([, item]) => item.id === tenantId)

  if (!tenantEntry) {
    throw new Error('Tenant no encontrado')
  }

  const [tenantKey, tenant] = tenantEntry

  tenants[tenantKey] = {
    ...tenant,
    name: payload.business_name,
    subdomain: payload.subdomain,
    plan: payload.plan_id,
    active: payload.active,
    primaryColor: payload.brand_colors?.primary,
    secondaryColor: payload.brand_colors?.secondary,
    maxUsers: payload.settings?.max_users,
    maxAppointments: payload.settings?.max_appointments,
    customDomainEnabled: payload.settings?.custom_domain_enabled,
    apiAccessEnabled: payload.settings?.api_access_enabled,
    businessType: payload.business_type,
    trialEndDate: payload.trial_end_date,
    address: payload.address,
    contact: {
      ...(tenant.contact || {}),
      name: payload.owner_name,
      email: payload.owner_email,
      phone: payload.owner_phone,
    },
  }

  return Promise.resolve(toTenantListItem(tenants[tenantKey]))
}