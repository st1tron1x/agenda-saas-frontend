<template>
  <v-card class="section-card pa-4">
    <FullCalendar :options="calendarOptions" />
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'


const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['create', 'edit', 'move', 'resize'])

function statusColor(status) {
  switch (status) {
    case 'CONFIRMADA':
      return '#22c55e'
    case 'PENDIENTE':
      return '#facc15'
    case 'CANCELADA':
      return '#ef4444'
    default:
      return '#3b82f6'
  }
}

const calendarEvents = computed(() =>
  props.events.map(e => ({
    ...e,
    backgroundColor: statusColor(e.status),
    borderColor: statusColor(e.status),
  }))
)

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locale: 'es',
  height: 'auto',

  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },

  selectable: true,
  editable: true,
  eventResizableFromStart: true,

  events: props.events.map(e=>({
    ...e,
    backgroundColor: statusColor(e.status),
    borderColor: statusColor(e.status),
  })),

  dateClick(info) {
    emit('create', info.dateStr)
  },

  eventClick(info) {
    emit('edit', info.event)
  },

  eventDrop(info){
    emit('move', info.event)
  },

  eventResize(info){
    emit('resize', info.event)
  },
}))
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}
</style>
