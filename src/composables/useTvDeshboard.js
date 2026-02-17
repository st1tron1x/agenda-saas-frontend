// ═══════════════════════════════════════════════════════════════════
// src/composables/useTvDashboard.js
// Composable Vue 3 para reemplazar los TODO del TvDashboard.vue
// ═══════════════════════════════════════════════════════════════════
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/services/api'           // ← ver api.js más abajo

export function useTvDashboard(tenantId) {
  const tenantInfo = ref({
    business_name:   '',
    tagline:         '',
    primary_color:   '#6366F1',
    secondary_color: '#EC4899',
    wifi_name:       '',
    logo_url:        null,
  })

  const currentCalling       = ref(null)
  const inService            = ref([])
  const waitingList          = ref([])
  const upcomingAppointments = ref([])
  const dailyStats           = ref({ completed: 0, pending: 0, waiting: 0 })
  const loading              = ref(true)
  const error                = ref(null)

  // ── 1. Info de branding del tenant ─────────────────────────────────
  async function loadTenantInfo() {
    try {
      const { data } = await api.get(`/tv/${tenantId}/display-info/`)
      tenantInfo.value = data
    } catch (err) {
      console.error('Error cargando tenant info:', err)
      error.value = err
    }
  }

  // ── 2. Estado en tiempo real de las citas ──────────────────────────
  async function loadAppointmentsData() {
    try {
      const { data } = await api.get('/tv/appointments/', {
        params: { tenant_id: tenantId }
      })

      currentCalling.value       = data.calling
      inService.value            = data.in_service
      waitingList.value          = data.waiting
      upcomingAppointments.value = data.upcoming
      dailyStats.value           = data.stats
    } catch (err) {
      console.error('Error cargando citas TV:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // ── Polling automático cada 30 segundos ────────────────────────────
  let refreshInterval = null

  onMounted(async () => {
    await loadTenantInfo()
    await loadAppointmentsData()
    refreshInterval = setInterval(loadAppointmentsData, 30_000)
  })

  onUnmounted(() => {
    clearInterval(refreshInterval)
  })

  return {
    tenantInfo,
    currentCalling,
    inService,
    waitingList,
    upcomingAppointments,
    dailyStats,
    loading,
    error,
    refresh: loadAppointmentsData,
  }
}


// ═══════════════════════════════════════════════════════════════════
// src/composables/useDashboardCharts.js
// Composable para las gráficas del dashboard
// ═══════════════════════════════════════════════════════════════════
import { ref, watch } from 'vue'
import api from '@/services/api'

export function useDashboardCharts(period = ref('month')) {
  const summary      = ref(null)
  const pieStatus    = ref(null)    // Pie: citas por estado
  const barRevenue   = ref(null)    // Barras: ingresos por servicio
  const barTimeline  = ref(null)    // Barras: citas en el tiempo
  const pieClients   = ref(null)    // Pie: nuevos vs recurrentes
  const loading      = ref(false)
  const error        = ref(null)

  async function loadAll() {
    loading.value = true
    error.value   = null

    try {
      const p = period.value

      const [sumRes, statusRes, revenueRes, timeRes, clientRes] = await Promise.all([
        api.get('/dashboard/summary/',                       { params: { period: p } }),
        api.get('/dashboard/charts/appointments-by-status/', { params: { period: p } }),
        api.get('/dashboard/charts/revenue-by-service/',     { params: { period: p } }),
        api.get('/dashboard/charts/appointments-over-time/', { params: { period: p, group: p === 'year' ? 'month' : 'day' } }),
        api.get('/dashboard/charts/client-types/',           { params: { period: p } }),
      ])

      summary.value     = sumRes.data
      pieStatus.value   = statusRes.data.chart
      barRevenue.value  = revenueRes.data.chart
      barTimeline.value = timeRes.data.chart
      pieClients.value  = clientRes.data.chart
    } catch (err) {
      console.error('Error cargando dashboard:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Recargar automáticamente cuando cambie el periodo
  watch(period, loadAll, { immediate: true })

  return {
    summary,
    pieStatus,
    barRevenue,
    barTimeline,
    pieClients,
    loading,
    error,
    reload: loadAll,
  }
}


// ═══════════════════════════════════════════════════════════════════
// src/services/api.js
// Instancia de Axios con JWT automático
// ═══════════════════════════════════════════════════════════════════
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// ── Interceptor REQUEST: inyectar token ───────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor RESPONSE: renovar token si expira ────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh/`,
          { refresh: refreshToken }
        )

        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`

        return api(original)   // reintentar la petición original
      } catch {
        // Si el refresh también falla → logout
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api


// ═══════════════════════════════════════════════════════════════════
// src/stores/auth.js  (Pinia)
// Store de autenticación
// ═══════════════════════════════════════════════════════════════════
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user        = ref(null)
  const accessToken = ref(localStorage.getItem('access_token'))

  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin         = computed(() => user.value?.role === 'TENANT_ADMIN')

  async function login(email, password) {
    const { data } = await api.post('/auth/login/', { email, password })

    user.value        = data.user
    accessToken.value = data.access_token

    localStorage.setItem('access_token',  data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
  }

  async function fetchMe() {
    const { data } = await api.get('/auth/me/')
    user.value = data.user
  }

  async function logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      await api.post('/auth/logout/', { refresh_token: refreshToken })
    } finally {
      user.value        = null
      accessToken.value = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  return { user, accessToken, isAuthenticated, isAdmin, login, logout, fetchMe }
})


// ═══════════════════════════════════════════════════════════════════
// .env.local  (en la raíz del proyecto Vite)
// ═══════════════════════════════════════════════════════════════════
/*
VITE_API_URL=http://localhost:8000/api
*/


// ═══════════════════════════════════════════════════════════════════
// CÓMO USAR EN TvDashboard.vue — reemplazar los TODO
// ═══════════════════════════════════════════════════════════════════
/*
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTvDashboard } from '@/composables/useTvDashboard'   // ← importar

const route    = useRoute()
const tenantId = route.params.tenantId || route.query.tenantId || 'demo'

// ── reemplaza los ref manuales y los TODO: ──────────────────────
const {
  tenantInfo,
  currentCalling,
  inService,
  waitingList,
  upcomingAppointments,
  dailyStats,
} = useTvDashboard(tenantId)

// El resto del script (currentTime, currentDate, helpers) se queda igual
</script>
*/


// ═══════════════════════════════════════════════════════════════════
// CÓMO USAR EN Dashboard.vue (gráficas)
// ═══════════════════════════════════════════════════════════════════
/*
<script setup>
import { ref } from 'vue'
import { useDashboardCharts } from '@/composables/useDashboardCharts'

const period = ref('month')   // 'today' | 'week' | 'month' | 'year'

const {
  summary,      // tarjetas superiores
  pieStatus,    // pie: citas por estado
  barRevenue,   // barras: ingresos por servicio
  barTimeline,  // barras: citas en el tiempo
  pieClients,   // pie: nuevos vs recurrentes
  loading,
} = useDashboardCharts(period)
</script>

<template>
  <!-- Selector de periodo -->
  <v-btn-toggle v-model="period">
    <v-btn value="today">Hoy</v-btn>
    <v-btn value="week">Semana</v-btn>
    <v-btn value="month">Mes</v-btn>
    <v-btn value="year">Año</v-btn>
  </v-btn-toggle>

  <!-- Tarjetas resumen -->
  <v-card v-if="summary">
    <div>Total citas: {{ summary.appointments.total }}</div>
    <div>Ingresos: {{ summary.revenue.completed_only }}</div>
    <div>Clientes nuevos: {{ summary.clients.new_this_period }}</div>
  </v-card>

  <!-- Pie: citas por estado — con Chart.js o vue-chartjs -->
  <Doughnut v-if="pieStatus" :data="pieStatus" />

  <!-- Barras: ingresos por servicio -->
  <Bar v-if="barRevenue" :data="barRevenue" />

  <!-- Barras: citas en el tiempo -->
  <Bar v-if="barTimeline" :data="barTimeline" />

  <!-- Pie: clientes nuevos vs recurrentes -->
  <Pie v-if="pieClients" :data="pieClients" />
</template>
*/