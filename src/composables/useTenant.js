// UseTenant.js
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { api } from '@/services/api'
import { tenants } from '../tenants/tenant.config'

export function useTenant() {
  const auth = useAuth()
  const tenantState = ref(tenants.default)

  // MOCK: luego se detecta por subdominio
  const hostname = window.location.hostname

  let tenantKey = 'default'
  if (hostname.includes('xiomy')) tenantKey = 'xiomy'
  if (hostname.includes('go')) tenantKey = 'go'

  tenantState.value = tenants[tenantKey] || tenants.default

  onMounted(async () => {
    const tenantId = auth.state.user?.tenantId
    if (!tenantId) return

    try {
      const result = await api.get('/tenant/branding', {
        headers: { 'X-Tenant-ID': tenantId },
      })

      if (result.success && result.data) {
        const data = result.data
        tenantState.value = {
          ...tenantState.value,
          id: data.id,
          name: data.business_name,
          subdomain: data.subdomain,
          logo: data.logo ? { src: data.logo } : tenantState.value.logo,
          primaryColor: data.brand_colors?.primary || tenantState.value.primaryColor,
          secondaryColor: data.brand_colors?.secondary || tenantState.value.secondaryColor,
          gradient: tenantState.value.gradient,
        }
      }
    } catch {
      // Mantener mock si falla
    }
  })

  const tenant = computed(() => tenantState.value)

  return { tenant }
}