<template>
  <v-card class="section-card pa-4">
    <FullCalendar :options="calendarOptions" />
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const showModal = ref(false)
const selectedAppointment = ref(null)
const selectedDate = ref(null)


const props = defineProps({
  events: Array,
})

const emit = defineEmits(['create', 'edit'])

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

const calendarOptions = {
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
  editable: false,

  events: props.events.map(e => ({
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
}

const openNewAppointment = (date) => {
  selectedAppointment.value = null
  modalOpen.value = true
}

</script>

<style scoped>
.section-card {
  border-radius: 18px;
}
</style>
