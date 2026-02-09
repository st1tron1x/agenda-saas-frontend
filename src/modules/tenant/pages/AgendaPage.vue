<template>
  <v-container fluid class="pa-6">

    <!-- HEADER -->
    <v-card class="section-card pa-4 mb-4 d-flex justify-space-between align-center">
      <div>
        <h2 class="text-h6 font-weight-bold">Agenda</h2>
        <span class="text-caption text-grey">
          Gestiona tus citas y calendario
        </span>
      </div>

      <div class="d-flex gap-2">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openNewAppointment"
        >
          Nueva cita
        </v-btn>
      </div>
    </v-card>

    <!-- FILTROS -->
    <v-card class="section-card pa-4 mb-4">
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            variant="outlined"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            label="Estado"
            :items="statusFilters"
            density="comfortable"
            variant="outlined"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            label="Fecha"
            type="date"
            density="comfortable"
            variant="outlined"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            label="Servicio"
            :items="serviceFilters"
            density="comfortable"
            variant="outlined"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- TABLA DE CITAS -->
    <v-card class="section-card">
      <v-table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.id">
            <td>{{ formatDate(appointment.date) }}</td>
            <td>{{ appointment.time }}</td>
            <td>{{ appointment.clientName }}</td>
            <td>{{ appointment.serviceName }}</td>
            <td>
              <v-chip
                size="small"
                :color="getStatusColor(appointment.status)"
              >
                {{ appointment.status }}
              </v-chip>
            </td>
            <td>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="editAppointment(appointment)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="error"
                @click="deleteAppointment(appointment)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-alert
        v-if="appointments.length === 0"
        type="info"
        variant="tonal"
        class="ma-4"
      >
        No hay citas registradas
      </v-alert>
    </v-card>

    <!-- MODAL -->
    <AppointmentModal
      v-model="showModal"
      :appointment="selectedAppointment"
      @save="handleSave"
      @cancel="handleCancel"
    />

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import AppointmentModal from '@/modules/tenant/components/AppointmentModal.vue'

const showModal = ref(false)
const selectedAppointment = ref(null)

const statusFilters = ['Todos', 'CONFIRMADA', 'PENDIENTE', 'CANCELADA']
const serviceFilters = ['Todos', 'Micropigmentación', 'Diseño de cejas', 'Lifting de pestañas']

/* MOCK DATA */
const appointments = ref([
  {
    id: 1,
    date: '2026-02-10',
    time: '09:00',
    clientName: 'Ana Gómez',
    serviceName: 'Micropigmentación labios',
    status: 'CONFIRMADA',
  },
  {
    id: 2,
    date: '2026-02-10',
    time: '11:00',
    clientName: 'María Ruiz',
    serviceName: 'Diseño de cejas',
    status: 'PENDIENTE',
  },
  {
    id: 3,
    date: '2026-02-11',
    time: '14:00',
    clientName: 'Laura Torres',
    serviceName: 'Lifting de pestañas',
    status: 'CONFIRMADA',
  },
])

function openNewAppointment() {
  selectedAppointment.value = null
  showModal.value = true
}

function editAppointment(appointment) {
  selectedAppointment.value = { ...appointment }
  showModal.value = true
}

function deleteAppointment(appointment) {
  if (confirm('¿Estás seguro de eliminar esta cita?')) {
    const index = appointments.value.findIndex(a => a.id === appointment.id)
    if (index > -1) {
      appointments.value.splice(index, 1)
    }
  }
}

function handleSave(appointmentData) {
  console.log('Guardar cita:', appointmentData)
  // Aquí iría la llamada a la API
  showModal.value = false
}

function handleCancel(appointment) {
  console.log('Cancelar cita:', appointment)
  // Aquí iría la llamada a la API
  showModal.value = false
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getStatusColor(status) {
  const colors = {
    CONFIRMADA: 'success',
    PENDIENTE: 'warning',
    CANCELADA: 'error',
  }
  return colors[status] || 'grey'
}
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}

.gap-2 {
  gap: 8px;
}
</style>