<!-- src/modules/tenant/components/TodaySummary.vue -->
<template>
  <v-row>
    <v-col v-for="item in summary" :key="item.label" cols="12" md="3">
      <v-card elevation="2" class="pa-4">
        <div class="text-caption text-grey">{{ item.label }}</div>
        <div class="text-h5 font-weight-bold">{{ item.value }}</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const summary = [
  { label: 'Citas hoy', value: 12 },
  { label: 'En atención', value: 3 },
  { label: 'Pendientes', value: 7 },
  { label: 'Canceladas', value: 2 },
]
</script>
