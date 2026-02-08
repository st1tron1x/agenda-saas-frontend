<template>
  <FullCalendar
    ref="fullCalendar"
    :options="calendarOptions"
  />
</template>

<script setup>
import { ref, defineExpose } from 'vue'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const fullCalendar = ref(null)

/* EVENTOS MOCK */
const events = [
  {
    title: 'Ana Gómez - Micropigmentación',
    start: new Date().setHours(9, 0),
    end: new Date().setHours(10, 30),
    backgroundColor: '#22c55e', // confirmada
  },
  {
    title: 'María Ruiz - Cejas',
    start: new Date().setHours(11, 30),
    end: new Date().setHours(12, 30),
    backgroundColor: '#f59e0b', // pendiente
  },
  {
    title: 'Cancelada - Laura',
    start: new Date().setHours(15, 0),
    end: new Date().setHours(16, 0),
    backgroundColor: '#ef4444', // cancelada
  },
]

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

  initialView: 'timeGridWeek', // 👈 vista por defecto PROFESIONAL
  locale: 'es',
  height: 'auto',

  headerToolbar: false, // usamos nuestros propios botones

  slotMinTime: '08:00:00',
  slotMaxTime: '20:00:00',

  nowIndicator: true,
  editable: false,
  selectable: true,

  events,

  eventClick(info) {
    console.log('Editar cita:', info.event)
  },

  select(selection) {
    console.log('Nueva cita en:', selection.start, selection.end)
  },
}

/* Exponemos métodos al padre */
function changeView(viewName) {
  const api = fullCalendar.value.getApi()
  api.changeView(viewName)
}

defineExpose({
  changeView,
})
</script>

<style scoped>
/* Ajustes visuales */
:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-timegrid-slot) {
  height: 48px;
}

:deep(.fc-event) {
  border-radius: 8px;
  font-size: 0.75rem;
  padding: 2px 4px;
}
</style>
