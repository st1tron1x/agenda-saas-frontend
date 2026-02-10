import { ref } from 'vue'

export function useTenants() {
  const tenants = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadTenants = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Aquí harías la llamada a tu API
      // const response = await api.get('/tenants')
      // tenants.value = response.data
      
      // Datos de ejemplo
      await new Promise(resolve => setTimeout(resolve, 500))
      tenants.value = [
        {
          id: 1,
          name: 'Empresa Demo 1',
          slug: 'empresa-demo-1',
          status: 'active',
          planId: 2,
          planName: 'Plan Pro',
          users: 25,
          createdAt: new Date('2024-01-15')
        },
        {
          id: 2,
          name: 'Empresa Demo 2',
          slug: 'empresa-demo-2',
          status: 'active',
          planId: 1,
          planName: 'Plan Básico',
          users: 8,
          createdAt: new Date('2024-01-20')
        }
      ]
    } catch (err) {
      error.value = 'Error al cargar los tenants'
      console.error('Error loading tenants:', err)
    } finally {
      loading.value = false
    }
  }

  const createTenant = async (tenantData) => {
    loading.value = true
    error.value = null

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newTenant = {
        id: Date.now(),
        ...tenantData,
        users: 0,
        status: 'active',
        createdAt: new Date()
      }
      
      tenants.value.push(newTenant)
      return newTenant
    } catch (err) {
      error.value = 'Error al crear el tenant'
      console.error('Error creating tenant:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTenant = async (tenantId, tenantData) => {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = tenants.value.findIndex(t => t.id === tenantId)
      if (index !== -1) {
        tenants.value[index] = { ...tenants.value[index], ...tenantData }
      }
      
      return tenants.value[index]
    } catch (err) {
      error.value = 'Error al actualizar el tenant'
      console.error('Error updating tenant:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTenant = async (tenantId) => {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = tenants.value.findIndex(t => t.id === tenantId)
      if (index !== -1) {
        tenants.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Error al eliminar el tenant'
      console.error('Error deleting tenant:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTenantById = (tenantId) => {
    return tenants.value.find(t => t.id === tenantId)
  }

  return {
    tenants,
    loading,
    error,
    loadTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    getTenantById
  }
}