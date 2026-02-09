<template>
  <v-container fluid class="pa-6">

    <v-card class="pa-3 mb-4 d-flex flex-wrap gap-3">
      <v-chip color="green" label>Confirmada</v-chip>
      <v-chip color="amber" label>Pendiente</v-chip>
      <v-chip color="blue" label>En atención</v-chip>
      <v-chip color="red" label>Cancelada</v-chip>
    </v-card>


    <AgendaCalendar
      :events="events"
      @create="openCreate"
      @edit="openEdit"
      @move="onMove"
      @resize="onResize"
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
import { ref, watch } from 'vue'

import AgendaCalendar from '@/modules/tenant/components/AgendaCalendar.vue'
import AppointmentModal from '@/modules/tenant/components/AppointmentModal.vue'
import { useAgenda } from '@/modules/tenant/composables/useAgenda'

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

/* Estado modal */
const modalOpen = ref(false)
const selectedAppointment = ref(null)

/* Agenda global (Dashboard + Agenda) */
const { appointments } = useAgenda()

/* 🔑 Sincronización correcta */
watch(
  events,
  (val) => {
    appointments.value = val
  },
  { immediate: true }
)

/* ---------------- ACCIONES ---------------- */

function openCreate(date) {
  selectedAppointment.value = {
    clientId: null,
    serviceId: null,
    status: 'CONFIRMADA',
    date,
    time: '',
    notes: '',
  }
  modalOpen.value = true
}

function openEdit(event) {
  selectedAppointment.value = {
    id: event.id,
    clientId: event.extendedProps?.clientId ?? null,
    serviceId: event.extendedProps?.serviceId ?? null,
    status: event.extendedProps?.status,
    date: event.startStr.split('T')[0],
    time: event.startStr.split('T')[1]?.slice(0, 5),
    notes: event.extendedProps?.notes ?? '',
  }
  modalOpen.value = true
}

function saveAppointment(data) {
  console.log('Guardar cita:', data)
}

function cancelAppointment(data) {
  console.log('Cancelar cita:', data)
}

function onMove(event) {
  console.log('Cita movida:', {
    id: event.id,
    start: event.start,
    end: event.end,
  })
}

function onResize(event) {
  console.log('Cita redimensionada:', {
    id: event.id,
    start: event.start,
    end: event.end,
  })
}
</script>
