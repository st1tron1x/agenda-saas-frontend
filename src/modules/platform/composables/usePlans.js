import { ref } from 'vue'

export function usePlans() {
  const plans = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Simular datos iniciales (reemplazar con llamada a API real)
  const mockPlans = [
    {
      id: 1,
      name: 'Plan Básico',
      description: 'Perfecto para empezar',
      price: 9.99,
      period: 'mes',
      status: 'active',
      featured: false,
      features: [
        'Hasta 10 usuarios',
        'Agenda básica',
        'Soporte por email',
        '5GB de almacenamiento'
      ],
      usersCount: 45,
      tenantsCount: 12
    },
    {
      id: 2,
      name: 'Plan Pro',
      description: 'Para negocios en crecimiento',
      price: 29.99,
      period: 'mes',
      status: 'active',
      featured: true,
      features: [
        'Hasta 50 usuarios',
        'Agenda avanzada',
        'Soporte prioritario',
        '50GB de almacenamiento',
        'Reportes personalizados'
      ],
      usersCount: 128,
      tenantsCount: 34
    },
    {
      id: 3,
      name: 'Plan Enterprise',
      description: 'Solución completa para empresas',
      price: 99.99,
      period: 'mes',
      status: 'active',
      featured: false,
      features: [
        'Usuarios ilimitados',
        'Todas las funcionalidades',
        'Soporte 24/7',
        'Almacenamiento ilimitado',
        'Integración API',
        'Onboarding personalizado'
      ],
      usersCount: 78,
      tenantsCount: 8
    }
  ]

  const loadPlans = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      plans.value = mockPlans
    } catch (err) {
      error.value = 'Error al cargar los planes'
      console.error('Error loading plans:', err)
    } finally {
      loading.value = false
    }
  }

  const createPlan = async (planData) => {
    loading.value = true
    error.value = null

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newPlan = {
        id: Date.now(),
        ...planData,
        usersCount: 0,
        tenantsCount: 0,
        status: 'active'
      }
      
      plans.value.push(newPlan)
      return newPlan
    } catch (err) {
      error.value = 'Error al crear el plan'
      console.error('Error creating plan:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePlan = async (planId, planData) => {
    loading.value = true
    error.value = null

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = plans.value.findIndex(p => p.id === planId)
      if (index !== -1) {
        plans.value[index] = { ...plans.value[index], ...planData }
      }
      
      return plans.value[index]
    } catch (err) {
      error.value = 'Error al actualizar el plan'
      console.error('Error updating plan:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePlan = async (planId) => {
    loading.value = true
    error.value = null

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = plans.value.findIndex(p => p.id === planId)
      if (index !== -1) {
        plans.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Error al eliminar el plan'
      console.error('Error deleting plan:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPlanById = (planId) => {
    return plans.value.find(p => p.id === planId)
  }

  return {
    plans,
    loading,
    error,
    loadPlans,
    createPlan,
    updatePlan,
    deletePlan,
    getPlanById
  }
}