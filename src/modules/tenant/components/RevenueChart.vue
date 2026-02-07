<template>
  <v-card class="section-card">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      Ingresos últimos 7 días
    </v-card-title>

    <v-card-text>
      <apexchart
        type="bar"
        height="280"
        :options="chartOptions"
        :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const series = ref([
  {
    name: 'Ingresos',
    data: [120000, 90000, 150000, 70000, 180000, 200000, 160000],
  },
])

const chartOptions = ref({
  chart: {
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
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
        `$${val.toLocaleString('es-CO')}`,
    },
  },
  colors: ['#6366F1'], // luego vendrá del tenant
  grid: {
    strokeDashArray: 4,
  },
})
</script>
