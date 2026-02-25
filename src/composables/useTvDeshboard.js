// src/composables/useTvDashboard.js
import { ref, onMounted, onUnmounted } from 'vue'
import { api } from '@/services/api'

export function useTvDashboard(tenantId) {
  // ══════════════════════════════════════════════════════════════
  // Estado reactivo
  // ══════════════════════════════════════════════════════════════
  const tenantInfo = ref({
    business_name: '',
    tagline: '',
    primary_color: '#6366F1',
    secondary_color: '#EC4899',
    wifi_name: '',
    logo_url: null,
  })

  const currentCalling = ref(null)
  const inService = ref([])
  const waitingList = ref([])
  const upcomingAppointments = ref([])
  const dailyStats = ref({ 
    completed: 0, 
    pending: 0, 
    waiting: 0 
  })
  
  const loading = ref(true)
  const error = ref(null)

  // ══════════════════════════════════════════════════════════════
  // Cargar información del tenant (branding)
  // ══════════════════════════════════════════════════════════════
  async function loadTenantInfo() {
    try {
      console.log(`🎨 Cargando branding del tenant: ${tenantId}`)
      
      // ⭐ Llamada al backend sin autenticación (público)
      const response = await api.get(`/tv/${tenantId}/display-info`)
      
      if (response.success && response.data) {
        tenantInfo.value = {
          business_name: response.data.business_name || 'Sistema',
          tagline: response.data.tagline || '',
          primary_color: response.data.primary_color || '#6366F1',
          secondary_color: response.data.secondary_color || '#EC4899',
          wifi_name: response.data.wifi_name || '',
          logo_url: response.data.logo_url || null,
        }
        
        console.log('✅ Branding cargado:', tenantInfo.value)
      } else {
        console.warn('⚠️ Respuesta sin data, usando valores por defecto')
      }
    } catch (err) {
      console.error('❌ Error cargando tenant info:', err)
      error.value = 'Error al cargar información del tenant'
    }
  }

  // ══════════════════════════════════════════════════════════════
  // Cargar datos de citas en tiempo real
  // ══════════════════════════════════════════════════════════════
  async function loadAppointmentsData() {
    try {
      console.log(`📊 Cargando citas para tenant: ${tenantId}`)
      
      // ⭐ Llamada al backend sin autenticación (público)
      const response = await api.get('/tv/appointments', {
        params: { tenant_id: tenantId }
      })
      
      if (response.success && response.data) {
        const data = response.data
        
        // Actualizar estado con los datos del backend
        currentCalling.value = data.calling || null
        inService.value = data.in_service || []
        waitingList.value = data.waiting || []
        upcomingAppointments.value = data.upcoming || []
        dailyStats.value = data.stats || { completed: 0, pending: 0, waiting: 0 }
        
        console.log('✅ Citas cargadas:', {
          calling: !!currentCalling.value,
          inService: inService.value.length,
          waiting: waitingList.value.length,
          upcoming: upcomingAppointments.value.length,
          stats: dailyStats.value
        })
      } else {
        console.warn('⚠️ Respuesta sin data en citas')
      }
      
      error.value = null
    } catch (err) {
      console.error('❌ Error cargando citas:', err)
      error.value = 'Error al cargar datos de citas'
    } finally {
      loading.value = false
    }
  }

  // ══════════════════════════════════════════════════════════════
  // Lifecycle: Cargar datos y configurar polling
  // ══════════════════════════════════════════════════════════════
  let refreshInterval = null

  onMounted(async () => {
    console.log('🚀 TV Display montado, iniciando carga...')
    
    // Cargar datos iniciales
    await loadTenantInfo()
    await loadAppointmentsData()
    
    // Configurar polling cada 30 segundos
    refreshInterval = setInterval(() => {
      console.log('🔄 Refrescando datos de TV Display...')
      loadAppointmentsData()
    }, 30000) // 30 segundos
    
    console.log('✅ TV Display configurado con polling cada 30s')
  })

  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      console.log('🛑 Polling de TV Display detenido')
    }
  })

  // ══════════════════════════════════════════════════════════════
  // API pública del composable
  // ══════════════════════════════════════════════════════════════
  return {
    // Estado
    tenantInfo,
    currentCalling,
    inService,
    waitingList,
    upcomingAppointments,
    dailyStats,
    loading,
    error,
    
    // Métodos
    refresh: loadAppointmentsData,
  }
}