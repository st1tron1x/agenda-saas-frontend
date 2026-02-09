<template>
  <v-container fluid class="pa-6">

    <!-- HEADER -->
    <v-card class="pa-4 mb-4 d-flex align-center justify-space-between">
      <div>
        <h2 class="text-h6 font-weight-bold">
          {{ client.name }}
        </h2>
        <div class="text-caption text-grey">
          Cliente desde {{ client.createdAt }}
        </div>
      </div>

      <div class="d-flex gap-2">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-pencil"
          @click="editClient"
        >
          Editar
        </v-btn>

        <v-btn
          color="primary"
          prepend-icon="mdi-calendar-plus"
          @click="openNewAppointment"
        >
          Nueva cita
        </v-btn>
      </div>
    </v-card>

    <!-- CONTENT -->
    <v-row>

      <!-- INFO CLIENTE -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <h3 class="text-subtitle-1 font-weight-medium mb-3">
            Información del cliente
          </h3>

          <v-list density="compact">
            <v-list-item title="Teléfono" :subtitle="client.phone" />
            <v-list-item title="Email" :subtitle="client.email" />
            <v-list-item title="Dirección" :subtitle="client.address" />
            <v-list-item title="Ciudad" :subtitle="client.city" />
          </v-list>
        </v-card>
      </v-col>

      <!-- HISTORIAL -->
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <h3 class="text-subtitle-1 font-weight-medium mb-3">
            Historial de citas
          </h3>

          <v-alert
            v-if="appointments.length === 0"
            type="info"
            variant="tonal"
          >
            Este cliente aún no tiene citas registradas.
          </v-alert>

          <v-timeline v-else density="compact">
            <v-timeline-item
              v-for="appt in appointments"
              :key="appt.id"
              :dot-color="statusColor(appt.status)"
            >
              <div class="font-weight-medium">
                {{ appt.service }}
              </div>
              <div class="text-caption">
                {{ appt.date }} · {{ appt.time }}
              </div>
              <div class="text-caption text-grey">
                Estado: {{ appt.status }}
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>

    </v-row>

    <!-- Modal para nueva cita -->
    <AppointmentModal
      v-model="showAppointmentModal"
      :appointment="selectedAppointment"
      @save="handleSaveAppointment"
    />

    <!-- Modal para editar cliente -->
    <ClientFormModal
      v-model="showEditModal"
      :client="client"
      @save="handleSaveClient"
    />

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppointmentModal from '@/modules/tenant/components/AppointmentModal.vue'
import ClientFormModal from '@/modules/tenant/components/ClientFormModal.vue'

const route = useRoute()

const clientId = Number(route.params.id)

const showAppointmentModal = ref(false)
const showEditModal = ref(false)
const selectedAppointment = ref(null)

/* MOCK DATA (luego Django) */
const client = ref({
  id: clientId,
  name: 'Ana Gómez',
  phone: '3001234567',
  email: 'ana@email.com',
  address: 'Calle 123 #45-67',
  city: 'Cali',
  createdAt: '2025-11-12',
})

const appointments = ref([
  {
    id: 1,
    service: 'Micropigmentación labios',
    date: '2026-02-02',
    time: '09:00',
    status: 'CONFIRMADA',
  },
  {
    id: 2,
    service: 'Diseño de cejas',
    date: '2026-01-10',
    time: '11:30',
    status: 'CANCELADA',
  },
])

function editClient() {
  showEditModal.value = true
}

function openNewAppointment() {
  selectedAppointment.value = {
    clientId: clientId,
    serviceId: null,
    status: 'CONFIRMADA',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    notes: '',
  }
  showAppointmentModal.value = true
}

function handleSaveAppointment(appointmentData) {
  console.log('Guardar cita:', appointmentData)
  // Aquí irá la llamada a la API
  appointments.value.unshift(appointmentData)
  showAppointmentModal.value = false
}

function handleSaveClient(clientData) {
  console.log('Actualizar cliente:', clientData)
  // Aquí irá la llamada a la API
  Object.assign(client.value, clientData)
  showEditModal.value = false
}

function statusColor(status) {
  return {
    CONFIRMADA: 'green',
    PENDIENTE: 'orange',
    CANCELADA: 'red',
  }[status]
}

onMounted(() => {
  console.log('Cargando cliente', clientId)
  // Aquí se cargarían los datos del backend
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>