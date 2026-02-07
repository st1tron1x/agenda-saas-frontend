<template>
  <v-card elevation="2" rounded="lg">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Agenda</span>
      <QuickActions />
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-list density="comfortable">
        <v-list-item
          v-for="appointment in appointments"
          :key="appointment.id"
          class="mb-2"
        >
          <template #prepend>
            <v-avatar :color="statusColor(appointment.status)">
              <v-icon icon="mdi-calendar" />
            </v-avatar>
          </template>

          <v-list-item-title>
            {{ appointment.time }} — {{ appointment.client }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ appointment.service }}
          </v-list-item-subtitle>

          <template #append>
            <v-chip size="small" :color="statusColor(appointment.status)">
              {{ appointment.status }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import QuickActions from './QuickActions.vue'

const appointments = [
  {
    id: 1,
    time: '09:00',
    client: 'Laura Pérez',
    service: 'Lifting de pestañas',
    status: 'Confirmada',
  },
  {
    id: 2,
    time: '11:00',
    client: 'María Gómez',
    service: 'Micropigmentación labios',
    status: 'Pendiente',
  },
  {
    id: 3,
    time: '15:30',
    client: 'Ana Torres',
    service: 'Cejas HD',
    status: 'En atención',
  },
]

function statusColor(status) {
  return {
    Pendiente: 'grey',
    Confirmada: 'primary',
    'En atención': 'orange',
    Completada: 'success',
    Cancelada: 'error',
  }[status]
}
</script>