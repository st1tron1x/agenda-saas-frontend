<template>
  <v-container fluid class="tenant-dashboard pa-6">
    
    <!-- HEADER -->
    <v-card class="dashboard-header mb-6" flat>
      <div class="d-flex flex-column">
        <h2 class="text-h5 font-weight-bold">
          👋 Buen día, {{ tenantName }}
        </h2>
        <span class="text-caption text-grey">
          {{ todayLabel }}
        </span>
      </div>
    </v-card>

    <!-- KPI CARDS -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="card in kpis" :key="card.label">
        <v-card class="kpi-card" elevation="2">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h5 font-weight-bold">{{ card.value }}</div>
              <div class="text-caption">{{ card.label }}</div>
            </div>
            <v-icon size="32">{{ card.icon }}</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- MAIN GRID -->
    <v-row>
      <!-- AGENDA -->
      <v-col cols="12" md="8">
        <v-card class="section-card">
          <v-card-title>Agenda de hoy</v-card-title>
          <v-divider />

          <v-card-text>
            <div
              v-for="item in agenda"
              :key="item.time"
              class="agenda-item"
            >
              <div class="agenda-time">{{ item.time }}</div>
              <div>
                <div class="font-weight-medium">{{ item.client }}</div>
                <div class="text-caption text-grey">
                  {{ item.service }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ACCIONES -->
      <v-col cols="12" md="4">
        <v-card class="section-card">
          <v-card-title>Acciones rápidas</v-card-title>
          <v-divider />
          <v-card-text class="d-flex flex-column ga-3">
            <v-btn :style="{ backgroundColor: themePrimary }" size="small" height="40" class="text-caption text-white" block prepend-icon="mdi-calendar-plus">
              Nueva cita
            </v-btn>
            <v-btn variant="outlined" size="small" height="40" class="text-caption" block prepend-icon="mdi-account-plus">
              Nuevo cliente
            </v-btn>
            <v-btn variant="text" size="small" height="40" class="text-caption" block prepend-icon="mdi-calendar">
              Ver agenda
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>
<script setup>
import { computed } from 'vue'

import { useTenant } from '@/composables/useTenant'

const { tenant } = useTenant()

const themePrimary = computed(() => {
  return tenant.value?.primaryColor || '#6366F1'
})

const tenantName = 'Gloria Osorio Estudio'

const todayLabel = new Date().toLocaleDateString('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const kpis = [
  { label: 'Citas hoy', value: 12, icon: 'mdi-calendar' },
  { label: 'En atención', value: 3, icon: 'mdi-spa' },
  { label: 'Pendientes', value: 7, icon: 'mdi-timer-sand' },
  { label: 'Canceladas', value: 2, icon: 'mdi-close-circle' },
]

const agenda = [
  {
    time: '09:00',
    client: 'Ana Gómez',
    service: 'Micropigmentación labios',
  },
  {
    time: '11:30',
    client: 'María Ruiz',
    service: 'Diseño de cejas',
  },
]
</script>

<style scoped>
.tenant-dashboard {
  background-color: #f8fafc;
  min-height: 100%;
}

/* Header */
.dashboard-header {
  background: linear-gradient(90deg, #f1f5f9, #ffffff);
  border-radius: 16px;
  padding: 20px;
}

/* KPI cards */
.kpi-card {
  border-radius: 16px;
}

.kpi-card .v-icon {
  opacity: 0.6;
}

/* Section cards */
.section-card {
  border-radius: 18px;
}

/* Agenda */
.agenda-item {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.agenda-item:last-child {
  border-bottom: none;
}

.agenda-time {
  font-weight: 600;
  width: 60px;
  color: #64748b;
}
</style>