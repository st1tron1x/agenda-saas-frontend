<template>
  <div class="month-view">
    <!-- Encabezado de días de la semana -->
    <div class="weekdays-header">
      <div v-for="day in weekdayNames" :key="day" class="weekday-name">
        {{ day }}
      </div>
    </div>

    <!-- Grid de días del mes -->
    <div class="month-grid">
      <div
        v-for="day in calendarDays"
        :key="day.dateString"
        class="day-cell"
        :class="{
          'other-month': !day.isCurrentMonth,
          'today': day.isToday,
          'has-appointments': day.appointments.length > 0
        }"
        @click="handleDayClick(day)"
      >
        <div class="day-number">
          {{ day.dayNumber }}
        </div>

        <!-- Citas del día -->
        <div class="day-appointments">
          <div
            v-for="(appointment, index) in day.appointments.slice(0, 3)"
            :key="appointment.id"
            class="appointment-item"
            :style="{ backgroundColor: appointment.color }"
            @click.stop="handleAppointmentClick(appointment)"
          >
            <span class="appointment-time">{{ appointment.time }}</span>
            <span class="appointment-client">{{ appointment.clientName }}</span>
          </div>

          <!-- Mostrar más -->
          <div
            v-if="day.appointments.length > 3"
            class="more-appointments"
            @click.stop="handleDayClick(day)"
          >
            +{{ day.appointments.length - 3 }} más
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentDate: {
    type: Date,
    required: true,
  },
  appointments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['date-click', 'appointment-click'])

const weekdayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  
  // Primer día del mes
  const firstDay = new Date(year, month, 1)
  // Último día del mes
  const lastDay = new Date(year, month + 1, 0)
  
  // Día de la semana del primer día (0=Dom, 1=Lun, etc.)
  let firstDayOfWeek = firstDay.getDay()
  // Convertir a Lunes=0
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  
  const days = []
  const today = new Date()
  
  // Días del mes anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push(createDayObject(date, false, today))
  }
  
  // Días del mes actual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push(createDayObject(date, true, today))
  }
  
  // Días del mes siguiente para completar la grilla
  const remainingDays = 42 - days.length // 6 semanas x 7 días
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push(createDayObject(date, false, today))
  }
  
  return days
})

function createDayObject(date, isCurrentMonth, today) {
  const dateString = date.toISOString().split('T')[0]
  
  return {
    date,
    dateString,
    dayNumber: date.getDate(),
    isCurrentMonth,
    isToday: date.toDateString() === today.toDateString(),
    appointments: props.appointments.filter(apt => apt.date === dateString),
  }
}

function handleDayClick(day) {
  emit('date-click', day.date)
}

function handleAppointmentClick(appointment) {
  emit('appointment-click', appointment)
}
</script>

<style scoped>
.month-view {
  padding: 16px;
}

.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  margin-bottom: 1px;
}

.weekday-name {
  padding: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: #666;
  background-color: white;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
}

.day-cell {
  min-height: 100px;
  padding: 8px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.day-cell:hover {
  background-color: #f5f5f5;
}

.day-cell.other-month {
  background-color: #fafafa;
  opacity: 0.6;
}

.day-cell.today {
  background-color: #E3F2FD;
}

.day-cell.today .day-number {
  background-color: #2196F3;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.day-appointments {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.appointment-item {
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 11px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.appointment-item:hover {
  transform: translateX(2px);
}

.appointment-time {
  font-weight: 600;
  margin-right: 4px;
}

.appointment-client {
  font-weight: 500;
}

.more-appointments {
  padding: 4px 6px;
  font-size: 11px;
  color: #666;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.more-appointments:hover {
  background-color: #e0e0e0;
}
</style>