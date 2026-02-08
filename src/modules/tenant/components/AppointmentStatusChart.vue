<template>
  <v-card class="section-card">
    <v-card-title class="d-flex justify-space-between align-center">
      Estados de citas
      <span class="text-caption text-grey">Hoy</span>
    </v-card-title>

    <v-card-text>
      <apexchart
        type="donut"
        height="260"
        :options="chartOptions"
        :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const series = [7, 3, 9, 2] 
// Pendiente, En atención, Atendida, Cancelada

const chartOptions = computed(() => ({
  labels: ['Pendientes', 'En atención', 'Atendidas', 'Canceladas'],
  colors: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'],
  legend: {
    position: 'bottom',
    fontSize: '13px'
  },
  dataLabels: {
    enabled: true
  },
  stroke: {
    width: 0
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%'
      }
    }
  }
}))
</script>