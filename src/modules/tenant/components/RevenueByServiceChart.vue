<template>
  <v-card class="section-card">
    <v-card-title>Ingresos por servicio</v-card-title>
    <v-card-text>
      <apexchart
        type="pie"
        height="280"
        :options="chartOptions"
        :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useTenant } from '@/composables/useTenant'

const { tenant } = useTenant()

/**
 * 🔹 Datos MOCK (luego vienen del backend Django)
 */
const series = [450000, 300000, 200000]

const chartOptions = computed(() => ({
  labels: [
    'Micropigmentación',
    'Cejas',
    'Pestañas',
  ],
  colors: [
    tenant.value?.primaryColor || '#6366F1',
    '#22C55E',
    '#F59E0B',
  ],
  legend: {
    position: 'bottom',
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val.toFixed(1)}%`,
  },
  tooltip: {
    y: {
      formatter: (val) =>
        new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(val),
    },
  },
}))
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}
</style>