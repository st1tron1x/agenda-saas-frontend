<template>
  <div class="week-view">
    <!-- Encabezado de días -->
    <div class="week-header">
      <div class="time-column-header">Hora</div>
      <div
        v-for="day in weekDays"
        :key="day.dateString"
        class="day-header"
        :class="{ 'today': isToday(day.date) }"
      >
        <div class="day-name">{{ day.dayName }}</div>
        <div class="day-number">{{ day.dayNumber }}</div>
      </div>
    </div>

    <!-- Grid de horas -->
    <div class="week-grid">
      <!-- Columna de horas -->
      <div class="time-column">
        <div
          v-for="hour in hours"
          :key="hour"
          class="time-slot-label"
        >
          {{ formatHour(hour) }}
        </div>
      </div>

      <!-- Columnas de días -->
      <div class="days-grid">
        <div
          v-for="day in weekDays"
          :key="day.dateString"
          class="day-column"
        >
          <!-- Slots de tiempo -->
          <div
            v-for="hour in hours"
            :key="`${day.dateString}-${hour}`"
            class="time-slot"
            :class="{ 'current-time': isCurrentHour(day.date, hour) }"
            @click="handleSlotClick(day.dateString, hour)"
          >
            <!-- Citas en este slot -->
            <div
              v-for="appointment in getAppointmentsForSlot(day.dateString, hour)"
              :key="appointment.id"
              class="appointment-block"
              :style="getAppointmentStyle(appointment)"
              @click.stop="handleAppointmentClick(appointment)"
            >
              <div class="appointment-time">{{ appointment.time }}</div>
              <div class="appointment-client">{{ appointment.clientName }}</div>
              <div class="appointment-service">{{ appointment.serviceName }}</div>
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
  startDate: {
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

const weekDays = computed(() => {
  const days = []
  const start = new Date(props.startDate)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    
    days.push({
      date,
      dateString: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('es-CO', { weekday: 'short' }),
      dayNumber: date.getDate(),
    })
  }
  
  return days
})

function isToday(date) {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isCurrentHour(date, hour) {
  if (!isToday(date)) return false
  const now = new Date()
  return now.getHours() === hour
}

function formatHour(hour) {
  return `${hour.toString().padStart(2, '0')}:00`
}

function getAppointmentsForSlot(dateString, hour) {
  return props.appointments.filter(apt => {
    if (apt.date !== dateString) return false
    
    const [aptHour] = apt.time.split(':').map(Number)
    return aptHour === hour
  })
}

function getAppointmentStyle(appointment) {
  const duration = appointment.duration || 60
  const heightPercentage = (duration / 60) * 100
  
  return {
    height: `${heightPercentage}%`,
    backgroundColor: appointment.color || '#4CAF50',
    borderLeft: `4px solid ${appointment.color || '#4CAF50'}`,
  }
}

function handleSlotClick(dateString, hour) {
  const time = `${hour.toString().padStart(2, '0')}:00`
  emit('time-click', { date: dateString, time })
}

function handleAppointmentClick(appointment) {
  emit('appointment-click', appointment)
}
</script>

<style scoped>
.week-view {
  overflow: auto;
}

.week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 2px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.time-column-header {
  padding: 12px;
  font-weight: 500;
  color: #666;
}

.day-header {
  padding: 12px;
  text-align: center;
  border-left: 1px solid #e0e0e0;
}

.day-header.today {
  background-color: #E3F2FD;
}

.day-name {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}

.day-number {
  font-size: 20px;
  font-weight: 600;
  margin-top: 4px;
}

.week-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
}

.time-column {
  border-right: 2px solid #e0e0e0;
}

.time-slot-label {
  height: 60px;
  padding: 8px;
  font-size: 12px;
  color: #666;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-column {
  border-left: 1px solid #e0e0e0;
}

.time-slot {
  height: 60px;
  border-top: 1px solid #f0f0f0;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.time-slot:hover {
  background-color: #f5f5f5;
}

.time-slot.current-time {
  background-color: #FFF9C4;
}

.appointment-block {
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  padding: 6px 8px;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.appointment-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.appointment-time {
  font-weight: 600;
  font-size: 11px;
  margin-bottom: 2px;
}

.appointment-client {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.appointment-service {
  font-size: 11px;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>