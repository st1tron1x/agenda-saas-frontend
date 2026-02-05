<!-- src/modules/tenant/pages/StaffDashboard.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">
          Hola {{ userName }}
        </h1>
        <p class="text-caption text-grey">
          Estas son tus citas para hoy
        </p>
      </div>

      <v-chip color="primary" variant="flat">
        {{ today }}
      </v-chip>
    </div>

    <!-- Resumen -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-caption text-grey">Citas hoy</div>
          <div class="text-h4 font-weight-bold">
            {{ stats.total }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-caption text-grey">Completadas</div>
          <div class="text-h4 font-weight-bold text-success">
            {{ stats.completed }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-caption text-grey">Mi comisión estimada</div>
          <div class="text-h4 font-weight-bold text-primary">
            ${{ stats.commission }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Lista de citas -->
    <v-card>
      <v-list>
        <v-list-item
          v-for="cita in citas"
          :key="cita.id"
          class="py-3"
        >
          <v-list-item-title>
            {{ cita.time }} — {{ cita.client }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ cita.service }}
          </v-list-item-subtitle>

          <template #append>
            <v-chip
              size="small"
              :color="statusColor(cita.status)"
              class="mr-2"
            >
              {{ cita.status }}
            </v-chip>

            <v-btn
              v-if="cita.status === 'Pendiente'"
              size="small"
              variant="outlined"
              @click="startAppointment(cita)"
            >
              Atender
            </v-btn>

            <v-btn
              v-if="cita.status === 'En atención'"
              size="small"
              color="success"
              variant="flat"
              @click="finishAppointment(cita)"
            >
              Finalizar
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/stores/auth'

const auth = useAuth()

const userName = computed(() => auth.state.user?.name || 'Staff')

const today = new Date().toLocaleDateString('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

/**
 * MOCK DATA
 * Luego vendrá del backend
 */
const citas = [
  {
    id: 1,
    time: '09:00',
    client: 'Ana Rodríguez',
    service: 'Extensión de pestañas',
    status: 'Pendiente',
  },
  {
    id: 2,
    time: '11:00',
    client: 'Laura Gómez',
    service: 'Diseño de cejas',
    status: 'En atención',
  },
  {
    id: 3,
    time: '14:00',
    client: 'Diana Pérez',
    service: 'Uñas acrílicas',
    status: 'Finalizada',
  },
]

const stats = {
  total: citas.length,
  completed: citas.filter(c => c.status === 'Finalizada').length,
  commission: '85.000',
}

function statusColor(status) {
  if (status === 'Pendiente') return 'grey'
  if (status === 'En atención') return 'warning'
  if (status === 'Finalizada') return 'success'
}

function startAppointment(cita) {
  cita.status = 'En atención'
}

function finishAppointment(cita) {
  cita.status = 'Finalizada'
}
</script>