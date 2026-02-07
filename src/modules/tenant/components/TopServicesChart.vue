<template>
  <v-card class="section-card">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Top servicios</span>

      <!-- Filtro (UI, sin lógica aún) -->
      <v-select
        density="compact"
        variant="outlined"
        hide-details
        :items="ranges"
        v-model="selectedRange"
        style="max-width: 160px"
      />
    </v-card-title>

    <v-divider />

    <v-card-text>
      <apexchart
        type="bar"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

/* Filtro visual */
const ranges = ['Hoy', '7 días', '30 días']
const selectedRange = ref('7 días')

/* Mock data */
const services = [
  { name: 'Micropigmentación labios', count: 18 },
  { name: 'Diseño de cejas', count: 14 },
  { name: 'Lifting de pestañas', count: 9 },
  { name: 'Retoque', count: 6 },
]

const series = [
  {
    name: 'Servicios realizados',
    data: services.map(s => s.count),
  },
]

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: services.map(s => s.name),
  },
  colors: ['#6366F1'], // luego vendrá del tenant
}))
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}
</style>
