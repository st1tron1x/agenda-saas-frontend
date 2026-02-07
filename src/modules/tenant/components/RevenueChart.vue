<template>
  <v-card class="section-card pa-4">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      Ingresos por día
    </v-card-title>

    <apexchart
      type="bar"
      height="280"
      :options="chartOptions"
      :series="series"
    />
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const series = [
  {
    name: 'Ingresos',
    data: [120000, 180000, 150000, 220000, 280000, 200000, 260000],
  },
]

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '45%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  },
  yaxis: {
    labels: {
      formatter: (val) =>
        `$ ${val.toLocaleString('es-CO')}`,
    },
  },
  tooltip: {
    y: {
      formatter: (val) =>
        `$ ${val.toLocaleString('es-CO')}`,
    },
  },
  colors: ['#6366F1'],
}))
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}
</style>
