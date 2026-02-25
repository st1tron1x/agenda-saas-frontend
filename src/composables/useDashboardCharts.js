// src/composables/useDashboardCharts.js
// Composable para Dashboard con gráficas conectado al backend Django

import { ref, watch, onMounted } from 'vue'
import { api } from '@/services/api'

export function useDashboardCharts(period = ref('month')) {
  // ══════════════════════════════════════════════════════════════
  // Estado reactivo
  // ══════════════════════════════════════════════════════════════
  const summary = ref(null)
  const pieStatus = ref(null)      // Gráfica pie: citas por estado
  const barRevenue = ref(null)     // Gráfica barras: ingresos por servicio
  const barTimeline = ref(null)    // Gráfica barras: citas en el tiempo
  const pieClients = ref(null)     // Gráfica pie: nuevos vs recurrentes
  
  const loading = ref(false)
  const error = ref(null)

  // ══════════════════════════════════════════════════════════════
  // Cargar todas las gráficas en paralelo
  // ══════════════════════════════════════════════════════════════
  async function loadAll() {
    loading.value = true
    error.value = null

    try {
      const p = period.value
      
      console.log(`📊 Cargando dashboard para periodo: ${p}`)

      // ⭐ Llamadas paralelas al backend (requiere JWT)
      const [sumRes, statusRes, revenueRes, timeRes, clientRes] = await Promise.all([
        api.get('/dashboard/summary', { 
          params: { period: p } 
        }),
        api.get('/dashboard/charts/appointments-by-status', { 
          params: { period: p } 
        }),
        api.get('/dashboard/charts/revenue-by-service', { 
          params: { period: p } 
        }),
        api.get('/dashboard/charts/appointments-over-time', { 
          params: { 
            period: p, 
            group: p === 'year' ? 'month' : 'day' 
          } 
        }),
        api.get('/dashboard/charts/client-types', { 
          params: { period: p } 
        }),
      ])

      // Verificar que todas las respuestas sean exitosas
      if (!sumRes.success || !sumRes.data) {
        throw new Error('Error en summary')
      }
      if (!statusRes.success || !statusRes.data?.chart) {
        throw new Error('Error en appointments-by-status')
      }
      if (!revenueRes.success || !revenueRes.data?.chart) {
        throw new Error('Error en revenue-by-service')
      }
      if (!timeRes.success || !timeRes.data?.chart) {
        throw new Error('Error en appointments-over-time')
      }
      if (!clientRes.success || !clientRes.data?.chart) {
        throw new Error('Error en client-types')
      }

      // Asignar datos a las variables reactivas
      summary.value = sumRes.data
      pieStatus.value = statusRes.data.chart
      barRevenue.value = revenueRes.data.chart
      barTimeline.value = timeRes.data.chart
      pieClients.value = clientRes.data.chart

      console.log('✅ Dashboard cargado exitosamente:', {
        summary: !!summary.value,
        pieStatus: !!pieStatus.value,
        barRevenue: !!barRevenue.value,
        barTimeline: !!barTimeline.value,
        pieClients: !!pieClients.value,
      })
    } catch (err) {
      console.error('❌ Error cargando dashboard:', err)
      error.value = err.response?.data?.error || err.message || 'Error al cargar dashboard'
    } finally {
      loading.value = false
    }
  }

  // ══════════════════════════════════════════════════════════════
  // Watchers: Recargar automáticamente al cambiar periodo
  // ══════════════════════════════════════════════════════════════
  watch(period, (newPeriod) => {
    console.log(`🔄 Periodo cambiado a: ${newPeriod}, recargando...`)
    loadAll()
  }, { immediate: true })

  onMounted(() => {
    console.log('📈 Dashboard Charts montado')
  })

  // ══════════════════════════════════════════════════════════════
  // API pública del composable
  // ══════════════════════════════════════════════════════════════
  return {
    // Estado
    summary,
    pieStatus,
    barRevenue,
    barTimeline,
    pieClients,
    loading,
    error,
    
    // Métodos
    reload: loadAll,
  }
}