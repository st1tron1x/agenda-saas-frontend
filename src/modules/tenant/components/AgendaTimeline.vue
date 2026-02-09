<template>
  <v-card class="section-card">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Agenda de hoy</span>
      <v-chip size="small" variant="flat" color="primary">
        {{ currentTime }}
      </v-chip>
    </v-card-title>
    
    <v-divider />

    <v-card-text class="timeline pa-4">
      <div
        v-for="item in agenda"
        :key="item.id"
        class="timeline-item"
        :class="getItemClass(item)"
      >
        <!-- Hora -->
        <div class="timeline-time">
          {{ item.time }}
          
          <!-- Badge de demora -->
          <v-chip
            v-if="isDelayed(item)"
            size="x-small"
            color="error"
            variant="flat"
            class="ml-1 pulse-animation"
          >
            <v-icon size="x-small" start>mdi-alert</v-icon>
            {{ getDelayMinutes(item) }}min
          </v-chip>
        </div>

        <!-- Línea con semáforo -->
        <div class="timeline-line">
          <span
            class="timeline-dot"
            :class="item.status"
            :style="{ backgroundColor: getStatusColor(item) }"
          >
            <!-- Icono en el punto -->
            <v-icon
              v-if="isDelayed(item)"
              size="x-small"
              color="white"
            >
              mdi-alert
            </v-icon>
            <v-icon
              v-else-if="item.status === 'in_progress'"
              size="x-small"
              color="white"
            >
              mdi-play
            </v-icon>
            <v-icon
              v-else-if="item.status === 'done'"
              size="x-small"
              color="white"
            >
              mdi-check
            </v-icon>
          </span>
        </div>

        <!-- Contenido -->
        <div class="timeline-content">
          <div class="font-weight-medium">
            {{ item.client }}
          </div>

          <div class="text-caption text-grey">
            {{ item.service }}
          </div>

          <div class="d-flex align-center mt-1 gap-1">
            <v-chip
              size="x-small"
              :color="statusColor(item.status)"
              variant="flat"
            >
              {{ statusLabel(item.status) }}
            </v-chip>

            <!-- Indicador de tiempo transcurrido -->
            <v-chip
              v-if="item.status === 'in_progress'"
              size="x-small"
              color="warning"
              variant="outlined"
            >
              <v-icon size="x-small" start>mdi-timer-outline</v-icon>
              {{ item.duration }} min
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay citas -->
      <v-alert
        v-if="agenda.length === 0"
        type="info"
        variant="tonal"
        density="compact"
      >
        No hay citas programadas para hoy
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
let timeInterval = null

// MOCK DATA
const agenda = [
  {
    id: 1,
    time: '09:00',
    client: 'Ana Gómez',
    service: 'Micropigmentación labios',
    status: 'done', // pending, in_progress, done, cancelled
    duration: 120,
    scheduledDateTime: new Date(2026, 1, 9, 9, 0),
  },
  {
    id: 2,
    time: '10:30',
    client: 'María Gómez',
    service: 'Micropigmentación labios',
    status: 'pending',
    duration: 120,
    scheduledDateTime: new Date(2026, 1, 9, 10, 30),
  },
  {
    id: 3,
    time: '15:30',
    client: 'Ana Torres',
    service: 'Cejas HD',
    status: 'in_progress',
    duration: 90,
    scheduledDateTime: new Date(2026, 1, 9, 15, 30),
  },
  {
    id: 4,
    time: '17:00',
    client: 'Laura Pérez',
    service: 'Lifting de pestañas',
    status: 'cancelled',
    duration: 60,
    scheduledDateTime: new Date(2026, 1, 9, 17, 0),
  },
]

function isDelayed(item) {
  if (item.status !== 'pending') return false
  const now = new Date()
  return now > item.scheduledDateTime
}

function getDelayMinutes(item) {
  if (!isDelayed(item)) return 0
  const now = new Date()
  const diff = now - item.scheduledDateTime
  return Math.floor(diff / 60000)
}

function getStatusColor(item) {
  // Prioridad: demora
  if (isDelayed(item)) return '#F44336' // Rojo

  // Por estado
  return {
    pending: '#2196F3',    // Azul
    in_progress: '#FF9800', // Naranja
    done: '#4CAF50',       // Verde
    cancelled: '#9E9E9E',  // Gris
  }[item.status]
}

function statusLabel(status) {
  return {
    pending: 'Pendiente',
    in_progress: 'En atención',
    done: 'Atendida',
    cancelled: 'Cancelada',
  }[status]
}

function statusColor(status) {
  return {
    pending: 'info',
    in_progress: 'warning',
    done: 'success',
    cancelled: 'grey',
  }[status]
}

function getItemClass(item) {
  const classes = []
  
  if (isDelayed(item)) {
    classes.push('delayed-item')
  }
  
  if (item.status === 'in_progress') {
    classes.push('active-item')
  }
  
  return classes.join(' ')
}

function updateCurrentTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
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

.timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 90px 24px 1fr;
  align-items: flex-start;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.timeline-item:hover {
  background-color: #f5f5f5;
}

.timeline-item.delayed-item {
  background-color: #FFEBEE;
  border-left: 3px solid #F44336;
}

.timeline-item.active-item {
  background-color: #FFF3E0;
  border-left: 3px solid #FF9800;
}

.timeline-time {
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-line {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 4px;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 2;
}

.timeline-content {
  padding-top: 2px;
}

.gap-1 {
  gap: 4px;
}

/* Animación de pulso */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}
</style>