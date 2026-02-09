<template>
  <v-container fluid class="pa-6">

    <!-- HEADER -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">
          Dashboard
        </h1>
        <p class="text-caption text-grey">
          Bienvenido {{ userName }}
        </p>
      </div>

      <v-chip color="primary" variant="flat">
        {{ today }}
      </v-chip>
    </div>

    <!-- RESUMEN DEL DÍA -->
    <TodaySummary class="mb-6" />

    <!-- GRÁFICAS Y DATOS -->
    <v-row class="mb-6">
      <!-- Agenda de hoy -->
      <v-col cols="12" md="6">
        <AgendaTimeline />
      </v-col>

      <!-- Estados de citas -->
      <v-col cols="12" md="6">
        <AppointmentStatusChart />
      </v-col>
    </v-row>

    <!-- MÁS GRÁFICAS -->
    <v-row class="mb-6">
      <!-- Ingresos últimos 7 días -->
      <v-col cols="12" md="6">
        <RevenueChart />
      </v-col>

      <!-- Top servicios -->
      <v-col cols="12" md="6">
        <TopServicesChart />
      </v-col>
    </v-row>

    <!-- RESUMEN DE INGRESOS -->
    <RevenueSummary class="mb-6" />

    <!-- ACCIONES RÁPIDAS -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-subtitle-1 mb-3 font-weight-medium">
            Acciones rápidas
          </div>

          <v-btn
            block
            color="primary"
            class="mb-2"
            prepend-icon="mdi-calendar-plus"
            @click="showNewAppointment = true"
          >
            Nueva cita
          </v-btn>

          <v-btn
            block
            variant="outlined"
            class="mb-2"
            prepend-icon="mdi-account-plus"
            @click="showNewClient = true"
          >
            Nuevo cliente
          </v-btn>

          <v-btn
            block
            variant="text"
            to="/app/agenda"
          >
            Ver agenda completa
          </v-btn>
        </v-card>
      </v-col>

      <!-- Próximas citas -->
      <v-col cols="12" md="8">
        <UpcomingAppointments />
      </v-col>
    </v-row>

    <!-- MODALS -->
    <AppointmentModal
      v-model="showNewAppointment"
      @save="handleSaveAppointment"
    />

    <ClientFormModal
      v-model="showNewClient"
      @save="handleSaveClient"
    />

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/stores/auth'

// Componentes
import TodaySummary from '@/modules/tenant/components/TodaySummary.vue'
import AgendaTimeline from '@/modules/tenant/components/AgendaTimeline.vue'
import AppointmentStatusChart from '@/modules/tenant/components/AppointmentStatusChart.vue'
import RevenueChart from '@/modules/tenant/components/RevenueChart.vue'
import TopServicesChart from '@/modules/tenant/components/TopServicesChart.vue'
import RevenueSummary from '@/modules/tenant/components/RevenueSummary.vue'
import UpcomingAppointments from '@/modules/tenant/components/UpcomingAppointments.vue'
import AppointmentModal from '@/modules/tenant/components/AppointmentModal.vue'
import ClientFormModal from '@/modules/tenant/components/ClientFormModal.vue'

const auth = useAuth()

const showNewAppointment = ref(false)
const showNewClient = ref(false)

const userName = computed(() => auth.state.user?.name || 'Usuario')

const today = new Date().toLocaleDateString('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function handleSaveAppointment(data) {
  console.log('Guardar cita:', data)
  // Aquí iría la llamada a la API
  showNewAppointment.value = false
}

function handleSaveClient(data) {
  console.log('Guardar cliente:', data)
  // Aquí iría la llamada a la API
  showNewClient.value = false
}
</script>