<template>
  <v-container fluid class="pa-6">

    <AgendaCalendar
      :events="events"
      @create="openCreate"
      @edit="openEdit"
    />

    <AppointmentModal
      v-model="modalOpen"
      :appointment="selectedAppointment"
      @save="saveAppointment"
      @cancel="cancelAppointment"
    />

  </v-container>
</template>

<script setup>
import { ref } from 'vue'

import AgendaCalendar from '@/modules/tenant/components/AgendaCalendar.vue'
import AppointmentModal from '@/modules/tenant/components/AppointmentModal.vue'

/* MOCK DATA (luego Django) */
const events = ref([
  {
    id: 1,
    title: 'Ana Gómez – Labios',
    start: '2026-02-08T09:00',
    status: 'CONFIRMADA',
  },
  {
    id: 2,
    title: 'María Ruiz – Cejas',
    start: '2026-02-08T11:30',
    status: 'PENDIENTE',
  },
])

const modalOpen = ref(false)
const selectedAppointment = ref(null)

function openCreate(date) {
  selectedAppointment.value = {
    date: date,
    time: '',
    status: 'CONFIRMADA',
  }
  modalOpen.value = true
}

function openEdit(event) {
  selectedAppointment.value = {
    id: event.id,
    date: event.startStr.split('T')[0],
    time: event.startStr.split('T')[1]?.slice(0, 5),
    status: event.extendedProps.status,
  }
  modalOpen.value = true
}

function saveAppointment(data) {
  console.log('Guardar cita:', data)
  // 👉 Aquí luego va POST / PUT Django
}

function cancelAppointment(data) {
  console.log('Cancelar cita:', data)
  // 👉 Aquí luego va DELETE Django
}
</script>
