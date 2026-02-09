<template>
  <div class="day-view">
    <!-- Encabezado del día -->
    <div class="day-header">
      <h3 class="day-title">
        {{ formattedDate }}
      </h3>
      <div class="day-summary">
        {{ appointments.length }} citas programadas
      </div>
    </div>

    <!-- Grid de horas -->
    <div class="time-grid">
      <div
        v-for="hour in hours"
        :key="hour"
        class="hour-row"
        :class="{ 'current-hour': isCurrentHour(hour) }"
      >
        <!-- Etiqueta de hora -->
        <div class="hour-label">
          {{ formatHour(hour) }}
        </div>

        <!-- Slots de 30 minutos -->
        <div class="hour-slots">
          <div
            class="time-slot"
            :class="{ 'current-slot': isCurrentSlot(hour, 0) }"
            @click="handleSlotClick(hour, 0)"
          >
            <!-- Citas en el primer slot (00-30) -->
            <div
              v-for="appointment in getAppointmentsForSlot(hour, 0)"
              :key="appointment.id"
              class="appointment-block"
              :style="getAppointmentStyle(appointment)"
              @click.stop="handleAppointmentClick(appointment)"
            >
              <div class="appointment-header">
                <span class="appointment-time">{{ appointment.time }}</span>
                <span class="appointment-duration">{{ appointment.duration }} min</span>
              </div>
              <div class="appointment-client">{{ appointment.clientName }}</div>
              <div class="appointment-service">{{ appointment.serviceName }}</div>
              <v-chip
                size="x-small"
                :color="getStatusColor(appointment.status)"
                class="mt-1"
              >
                {{ appointment.status }}
              </v-chip>
            </div>
          </div>

          <div
            class="time-slot half"
            :class="{ 'current-slot': isCurrentSlot(hour, 30) }"
            @click="handleSlotClick(hour, 30)"
          >
            <!-- Citas en el segundo slot (30-60) -->
            <div
              v-for="appointment in getAppointmentsForSlot(hour, 30)"
              :key="appointment.id"
              class="appointment-block"
              :style="getAppointmentStyle(appointment)"
              @click.stop="handleAppointmentClick(appointment)"
            >
              <div class="appointment-header">
                <span class="appointment-time">{{ appointment.time }}</span>
                <span class="appointment-duration">{{ appointment.duration }} min</span>
              </div>
              <div class="appointment-client">{{ appointment.clientName }}</div>
              <div class="appointment-service">{{ appointment.serviceName }}</div>
              <v-chip
                size="x-small"
                :color="getStatusColor(appointment.status)"
                class="mt-1"
              >
                {{ appointment.status }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
  appointments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['time-click', 'appointment-click'])

// Horas del día (7 AM - 9 PM)
const hours = Array.from({ length: 15 }, (_, i) => i + 7)

const formattedDate = computed(() => {
  return props.date.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const dateString = computed(() => {
  return props.date.toISOString().split('T')[0]
})

function isToday() {
  const today = new Date()
  return props.date.toDateString() === today.toDateString()
}

function isCurrentHour(hour) {
  if (!isToday()) return false
  const now = new Date()
  return now.getHours() === hour
}

function isCurrentSlot(hour, minute) {
  if (!isToday()) return false
  const now = new Date()
  return now.getHours() === hour && now.getMinutes() >= minute && now.getMinutes() < minute + 30
}

function formatHour(hour) {
  return `${hour.toString().padStart(2, '0')}:00`
}

function getAppointmentsForSlot(hour, minute) {
  return props.appointments.filter(apt => {
    if (apt.date !== dateString.value) return false
    
    const [aptHour, aptMinute] = apt.time.split(':').map(Number)
    
    // Verificar si la cita comienza en este slot
    if (aptHour === hour && aptMinute >= minute && aptMinute < minute + 30) {
      return true
    }
    
    return false
  })
}

function getAppointmentStyle(appointment) {
  const duration = appointment.duration || 60
  // Calcular altura basada en duración (cada slot es 60px para 30 min)
  const heightPerSlot = 60
  const height = (duration / 30) * heightPerSlot
  
  return {
    height: `${height}px`,
    backgroundColor: appointment.color || '#4CAF50',
    borderLeft: `4px solid ${appointment.color || '#4CAF50'}`,
  }
}

function getStatusColor(status) {
  const colors = {
    CONFIRMADA: 'success',
    PENDIENTE: 'warning',
    CANCELADA: 'error',
  }
  return colors[status] || 'grey'
}

function handleSlotClick(hour, minute) {
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  emit('time-click', { date: dateString.value, time })
}

function handleAppointmentClick(appointment) {
  emit('appointment-click', appointment)
}
</script>

<style scoped>
.day-view {
  padding: 16px;
}

.day-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;
}

.day-title {
  font-size: 24px;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 4px;
}

.day-summary {
  font-size: 14px;
  color: #666;
}

.time-grid {
  display: flex;
  flex-direction: column;
}

.hour-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  border-top: 1px solid #e0e0e0;
  min-height: 120px;
}

.hour-row.current-hour {
  background-color: #FFF9C4;
}

.hour-label {
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-align: right;
  border-right: 2px solid #e0e0e0;
}

.hour-slots {
  display: flex;
  flex-direction: column;
}

.time-slot {
  flex: 1;
  min-height: 60px;
  padding: 4px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
}

.time-slot:hover {
  background-color: #f5f5f5;
}

.time-slot.half {
  border-top: 1px dashed #e0e0e0;
}

.time-slot.current-slot {
  background-color: #FFF59D;
}

.appointment-block {
  position: relative;
  padding: 12px;
  margin: 2px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.appointment-block:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.appointment-time {
  font-weight: 600;
  font-size: 14px;
}

.appointment-duration {
  font-size: 12px;
  opacity: 0.9;
}

.appointment-client {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
}

.appointment-service {
  font-size: 13px;
  opacity: 0.95;
  margin-bottom: 4px;
}
</style>