<template>
  <v-row class="mb-6">
    <v-col cols="12" md="3" v-for="item in items" :key="item.label">
      <v-card class="kpi-card" elevation="2">
        <v-card-text>
          <div class="text-h6 font-weight-bold">{{ item.value }}</div>
          <div class="text-caption text-grey">{{ item.label }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const items = [
  { label: 'Ingresos estimados', value: '$ 1.200.000' },
  { label: 'Ingresos reales', value: '$ 950.000' },
  { label: 'Diferencia', value: '- $ 250.000' },
  { label: 'Cumplimiento', value: '79%' },
]
</script>

<style scoped>
.kpi-card {
  border-radius: 16px;
}
</style>