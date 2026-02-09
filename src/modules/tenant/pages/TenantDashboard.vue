<template>
  <v-container fluid class="pa-6">

    <!-- HEADER CON ACCIONES RÁPIDAS -->
    <v-card class="section-card pa-4 mb-6">
      <v-row align="center">
        <v-col cols="12" md="6">
          <h1 class="text-h5 font-weight-bold">
            Dashboard
          </h1>
          <p class="text-caption text-grey mb-0">
            Bienvenido {{ userName }} · {{ today }}
          </p>
        </v-col>

        <!-- ACCIONES RÁPIDAS -->
        <v-col cols="12" md="6" class="text-right">
          <v-btn
            color="primary"
            prepend-icon="mdi-calendar-plus"
            class="mr-2"
            @click="showNewAppointment = true"
          >
            Nueva cita
          </v-btn>

          <v-btn
            variant="outlined"
            prepend-icon="mdi-account-plus"
            @click="showNewClient = true"
          >
            Nuevo cliente
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- ALERTAS DE DEMORAS -->
    <v-alert
      v-if="delayedAppointments.length > 0"
      type="warning"
      variant="tonal"
      class="mb-6"
      prominent
      border="start"
    >
      <v-row align="center">
        <v-col>
          <div class="text-subtitle-1 font-weight-bold">
            ⚠️ {{ delayedAppointments.length }} cita(s) con demora
          </div>
          <div class="text-caption">
            Hay citas que deberían estar en atención
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn
            size="small"
            variant="outlined"
            @click="scrollToDelayed"
          >
            Ver detalles
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <!-- RESUMEN DEL DÍA CON SEMÁFORO -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="stat in dayStats" :key="stat.label">
        <v-card 
          class="kpi-card pa-4" 
          elevation="2"
          :style="{ borderLeft: `4px solid ${stat.color}` }"
        >
          <div class="d-flex align-center mb-2">
            <v-icon :color="stat.color" size="small" class="mr-2">
              {{ stat.icon }}
            </v-icon>
            <span class="text-caption text-grey">{{ stat.label }}</span>
          </div>
          <div class="text-h4 font-weight-bold" :style="{ color: stat.color }">
            {{ stat.value }}
          </div>
          <div v-if="stat.subtitle" class="text-caption mt-1">
            {{ stat.subtitle }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- AGENDA DE HOY CON SEMÁFORO Y TIEMPO REAL -->
    <v-card class="section-card mb-6" ref="agendaSection">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Agenda de hoy</span>
        <v-chip size="small" variant="flat">
          {{ currentTime }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <v-list class="py-0">
          <v-list-item
            v-for="appointment in todayAppointments"
            :key="appointment.id"
            class="appointment-item"
            :class="getAppointmentClass(appointment)"
          >
            <!-- Indicador de semáforo -->
            <template #prepend>
              <div class="status-indicator-wrapper">
                <v-avatar
                  :color="getStatusColor(appointment)"
                  size="12"
                  class="status-indicator"
                >
                  <v-icon
                    v-if="isDelayed(appointment)"
                    size="x-small"
                    color="white"
                  >
                    mdi-alert
                  </v-icon>
                </v-avatar>
                
                <!-- Línea temporal -->
                <div class="timeline-line" />
              </div>
            </template>

            <v-list-item-title class="d-flex align-center">
              <span class="appointment-time font-weight-bold">
                {{ appointment.time }}
              </span>
              
              <!-- Badge de demora -->
              <v-chip
                v-if="isDelayed(appointment)"
                size="x-small"
                color="error"
                variant="flat"
                class="ml-2 pulse-animation"
              >
                <v-icon size="x-small" start>mdi-clock-alert</v-icon>
                {{ getDelayMinutes(appointment) }} min de retraso
              </v-chip>

              <span class="ml-3">{{ appointment.clientName }}</span>
            </v-list-item-title>

            <v-list-item-subtitle class="mt-1">
              <v-icon size="small" class="mr-1">mdi-scissors-cutting</v-icon>
              {{ appointment.serviceName }}
              <span class="ml-2 text-grey">· {{ appointment.duration }} min</span>
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex align-center gap-2">
                <!-- Estado actual -->
                <v-chip
                  :color="getStatusChipColor(appointment.status)"
                  size="small"
                  variant="flat"
                >
                  {{ getStatusLabel(appointment.status) }}
                </v-chip>

                <!-- Acciones rápidas -->
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      v-bind="props"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list density="compact">
                    <v-list-item
                      v-if="appointment.status === 'CONFIRMADA'"
                      @click="startAppointment(appointment)"
                    >
                      <template #prepend>
                        <v-icon size="small">mdi-play</v-icon>
                      </template>
                      <v-list-item-title>Iniciar atención</v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      v-if="appointment.status === 'EN_ATENCION'"
                      @click="completeAppointment(appointment)"
                    >
                      <template #prepend>
                        <v-icon size="small" color="success">mdi-check</v-icon>
                      </template>
                      <v-list-item-title>Marcar como completada</v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="editAppointment(appointment)">
                      <template #prepend>
                        <v-icon size="small">mdi-pencil</v-icon>
                      </template>
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      v-if="appointment.status !== 'CANCELADA'"
                      @click="cancelAppointment(appointment)"
                    >
                      <template #prepend>
                        <v-icon size="small" color="error">mdi-cancel</v-icon>
                      </template>
                      <v-list-item-title>Cancelar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <v-alert
          v-if="todayAppointments.length === 0"
          type="info"
          variant="tonal"
          class="ma-4"
        >
          No hay citas programadas para hoy
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- GRÁFICAS Y DATOS -->
    <v-row class="mb-6">
      <!-- Estados de citas con semáforo -->
      <v-col cols="12" md="4">
        <AppointmentStatusChart />
      </v-col>

      <!-- Ingresos últimos 7 días -->
      <v-col cols="12" md="4">
        <RevenueChart />
      </v-col>

      <!-- Top servicios -->
      <v-col cols="12" md="4">
        <TopServicesChart />
      </v-col>
    </v-row>

    <!-- RESUMEN FINANCIERO -->
    <RevenueSummary class="mb-6" />

    <!-- PRÓXIMAS CITAS -->
    <UpcomingAppointments />

    <!-- MODALS -->
    <AppointmentModal
      v-model="showNewAppointment"
      :appointment="selectedAppointment"
      @save="handleSaveAppointment"
    />

    <ClientFormModal
      v-model="showNewClient"
      @save="handleSaveClient"
    />

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/stores/auth'

// Componentes
import AppointmentStatusChart from '@/modules/tenant/components/AppointmentStatusChart.vue'
import RevenueChart from '@/modules/tenant/components/RevenueChart.vue'
import TopServicesChart from '@/modules/tenant/components/TopServicesChart.vue'
import RevenueSummary from '@/modules/tenant/components/RevenueSummary.vue'
import UpcomingAppointments from '@/modules/tenant/components/UpcomingAppointments.vue'
import AppointmentModal from '@/modules/tenant/components/AppointmentModal.vue'
import ClientFormModal from '@/modules/tenant/components/ClientFormModal.vue'

const auth = useAuth()

const showNewAppointment = ref(false)
const showNewClient = ref(false)
const selectedAppointment = ref(null)
const currentTime = ref('')
const agendaSection = ref(null)

let timeInterval = null

const userName = computed(() => auth.state.user?.name || 'Usuario')

const today = new Date().toLocaleDateString('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// MOCK DATA - Citas de hoy
const todayAppointments = ref([
  {
    id: 1,
    clientName: 'Ana Gómez',
    serviceName: 'Micropigmentación labios',
    time: '09:00',
    duration: 120,
    status: 'COMPLETADA', // CONFIRMADA, EN_ATENCION, COMPLETADA, CANCELADA
    scheduledDateTime: new Date(2026, 1, 9, 9, 0), // Fecha/hora programada
  },
  {
    id: 2,
    clientName: 'María Ruiz',
    serviceName: 'Diseño de cejas',
    time: '10:30',
    duration: 90,
    status: 'CONFIRMADA',
    scheduledDateTime: new Date(2026, 1, 9, 10, 30),
  },
  {
    id: 3,
    clientName: 'Laura Torres',
    serviceName: 'Lifting de pestañas',
    time: '11:00',
    duration: 60,
    status: 'EN_ATENCION',
    scheduledDateTime: new Date(2026, 1, 9, 11, 0),
  },
  {
    id: 4,
    clientName: 'Carolina Soto',
    serviceName: 'Retoque labios',
    time: '14:00',
    duration: 90,
    status: 'CONFIRMADA',
    scheduledDateTime: new Date(2026, 1, 9, 14, 0),
  },
  {
    id: 5,
    clientName: 'Diana Pérez',
    serviceName: 'Uñas acrílicas',
    time: '16:30',
    duration: 120,
    status: 'CANCELADA',
    scheduledDateTime: new Date(2026, 1, 9, 16, 30),
  },
])

// Estadísticas del día con semáforo
const dayStats = computed(() => {
  const total = todayAppointments.value.length
  const completed = todayAppointments.value.filter(a => a.status === 'COMPLETADA').length
  const inProgress = todayAppointments.value.filter(a => a.status === 'EN_ATENCION').length
  const confirmed = todayAppointments.value.filter(a => a.status === 'CONFIRMADA').length
  const delayed = delayedAppointments.value.length

  return [
    {
      label: 'Total del día',
      value: total,
      icon: 'mdi-calendar-check',
      color: '#2196F3',
      subtitle: 'Citas programadas',
    },
    {
      label: 'Completadas',
      value: completed,
      icon: 'mdi-check-circle',
      color: '#4CAF50',
      subtitle: `${total > 0 ? Math.round((completed/total)*100) : 0}% del día`,
    },
    {
      label: 'En atención',
      value: inProgress,
      icon: 'mdi-account-clock',
      color: '#FF9800',
      subtitle: 'Atendiendo ahora',
    },
    {
      label: 'Con demora',
      value: delayed,
      icon: 'mdi-clock-alert',
      color: delayed > 0 ? '#F44336' : '#9E9E9E',
      subtitle: delayed > 0 ? '¡Requiere atención!' : 'Todo al día',
    },
  ]
})

// Citas con demora
const delayedAppointments = computed(() => {
  const now = new Date()
  return todayAppointments.value.filter(apt => {
    // Solo verificar citas confirmadas que ya deberían estar en atención
    if (apt.status !== 'CONFIRMADA') return false
    
    // Verificar si ya pasó la hora programada
    return now > apt.scheduledDateTime
  })
})

// Verificar si una cita está demorada
function isDelayed(appointment) {
  if (appointment.status !== 'CONFIRMADA') return false
  const now = new Date()
  return now > appointment.scheduledDateTime
}

// Calcular minutos de demora
function getDelayMinutes(appointment) {
  if (!isDelayed(appointment)) return 0
  const now = new Date()
  const diff = now - appointment.scheduledDateTime
  return Math.floor(diff / 60000) // Convertir a minutos
}

// Color del semáforo según estado y demora
function getStatusColor(appointment) {
  // Prioridad a demora
  if (isDelayed(appointment)) return '#F44336' // Rojo - Demorado
  
  // Por estado
  switch (appointment.status) {
    case 'CONFIRMADA':
      return '#2196F3' // Azul - Confirmada
    case 'EN_ATENCION':
      return '#FF9800' // Naranja - En atención
    case 'COMPLETADA':
      return '#4CAF50' // Verde - Completada
    case 'CANCELADA':
      return '#9E9E9E' // Gris - Cancelada
    default:
      return '#9E9E9E'
  }
}

// Color del chip de estado
function getStatusChipColor(status) {
  switch (status) {
    case 'CONFIRMADA': return 'info'
    case 'EN_ATENCION': return 'warning'
    case 'COMPLETADA': return 'success'
    case 'CANCELADA': return 'grey'
    default: return 'grey'
  }
}

// Etiqueta del estado
function getStatusLabel(status) {
  const labels = {
    CONFIRMADA: 'Confirmada',
    EN_ATENCION: 'En atención',
    COMPLETADA: 'Completada',
    CANCELADA: 'Cancelada',
  }
  return labels[status] || status
}

// Clase CSS según estado
function getAppointmentClass(appointment) {
  const classes = []
  
  if (isDelayed(appointment)) {
    classes.push('appointment-delayed')
  }
  
  if (appointment.status === 'EN_ATENCION') {
    classes.push('appointment-active')
  }
  
  if (appointment.status === 'COMPLETADA') {
    classes.push('appointment-completed')
  }
  
  return classes.join(' ')
}

// Acciones
function startAppointment(appointment) {
  appointment.status = 'EN_ATENCION'
  console.log('Iniciando atención:', appointment)
}

function completeAppointment(appointment) {
  appointment.status = 'COMPLETADA'
  console.log('Completando cita:', appointment)
}

function editAppointment(appointment) {
  selectedAppointment.value = { ...appointment }
  showNewAppointment.value = true
}

function cancelAppointment(appointment) {
  if (confirm('¿Estás seguro de cancelar esta cita?')) {
    appointment.status = 'CANCELADA'
    console.log('Cancelando cita:', appointment)
  }
}

function handleSaveAppointment(data) {
  console.log('Guardar cita:', data)
  showNewAppointment.value = false
}

function handleSaveClient(data) {
  console.log('Guardar cliente:', data)
  showNewClient.value = false
}

function scrollToDelayed() {
  agendaSection.value?.$el.scrollIntoView({ behavior: 'smooth' })
}

// Actualizar hora actual cada segundo
function updateCurrentTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  updateCurrentTime()
  timeInterval = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}

.kpi-card {
  border-radius: 16px;
  transition: transform 0.2s;
}

.kpi-card:hover {
  transform: translateY(-4px);
}

.appointment-item {
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.appointment-item:hover {
  background-color: #f5f5f5;
}

.appointment-delayed {
  border-left-color: #F44336 !important;
  background-color: #FFEBEE;
}

.appointment-active {
  border-left-color: #FF9800 !important;
  background-color: #FFF3E0;
}

.appointment-completed {
  opacity: 0.7;
}

.status-indicator-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-right: 16px;
}

.status-indicator {
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.timeline-line {
  position: absolute;
  top: 16px;
  width: 2px;
  height: calc(100% + 20px);
  background-color: #e0e0e0;
  z-index: 1;
}

.appointment-time {
  font-size: 16px;
  color: #1976D2;
}

.gap-2 {
  gap: 8px;
}

/* Animación de pulso para demoras */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}
</style>