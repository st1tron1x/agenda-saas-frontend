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

    <!-- KPIs -->
    <RevenueSummary class="mb-6" />

    <!-- ACCIONES RÁPIDAS -->
    <v-card class="section-card pa-3 mb-6">
      <div class="d-flex flex-wrap gap-3">
        <v-btn
          :style="{ backgroundColor: themePrimary }"
          class="text-white"
          prepend-icon="mdi-calendar-plus"
        >
          Nueva cita
        </v-btn>

        <v-btn variant="outlined" prepend-icon="mdi-account-plus">
          Nuevo cliente
        </v-btn>

        <v-btn variant="tonal" prepend-icon="mdi-calendar">
          Ver agenda
        </v-btn>
      </div>
    </v-card>

    <!-- OPERACIÓN DIARIA -->
    <v-row class="mb-6">
      <v-col cols="12">
        <AgendaTimeline />
      </v-col>
    </v-row>

    <!-- MÉTRICAS DEL DÍA -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <AppointmentStatusChart />
      </v-col>

      <v-col cols="12" md="6">
        <RevenueChart />
      </v-col>
    </v-row>

    <!-- INSIGHTS -->
    <v-row>
      <v-col cols="12" md="6">
        <RevenueByServiceChart />
      </v-col>

      <v-col cols="12" md="6">
        <TopServicesChart />
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useTenant } from '@/composables/useTenant'

import AgendaTimeline from '@/modules/tenant/components/AgendaTimeline.vue'
import RevenueSummary from '@/modules/tenant/components/RevenueSummary.vue'
import RevenueChart from '@/modules/tenant/components/RevenueChart.vue'
import RevenueByServiceChart from '@/modules/tenant/components/RevenueByServiceChart.vue'
import TopServicesChart from '@/modules/tenant/components/TopServicesChart.vue'
import AppointmentStatusChart from '@/modules/tenant/components/AppointmentStatusChart.vue'
import { useAgenda } from '@/modules/tenant/composables/useAgenda'

const { tenant } = useTenant()

const themePrimary = computed(() => tenant.value?.primaryColor || '#6366F1')

const tenantName = 'Gloria Osorio Estudio'

const todayLabel = new Date().toLocaleDateString('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const {totalToday, byStatus } = useAgenda()
</script>

<style scoped>
.tenant-dashboard {
  background-color: #f8fafc;
  min-height: 100%;
}

.dashboard-header {
  background: linear-gradient(90deg, #f1f5f9, #ffffff);
  border-radius: 16px;
  padding: 20px;
}

.section-card {
  border-radius: 18px;
}

.gap-3 {
  gap: 12px;
}
</style>
