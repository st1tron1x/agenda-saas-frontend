<template>
  <v-card
    class="service-card pa-4"
    :style="{ borderLeft: `6px solid ${service.color}` }"
  >
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="font-weight-bold">
        {{ service.name }}
      </div>

      <v-chip
        size="small"
        :color="service.active ? 'green' : 'grey'"
        label
      >
        {{ service.active ? 'Activo' : 'Inactivo' }}
      </v-chip>
    </div>

    <div class="text-caption text-grey mb-3">
      Duración: {{ service.duration }} min
    </div>

    <div class="text-subtitle-1 font-weight-medium mb-3">
      $ {{ formatPrice(service.price) }}
    </div>

    <v-divider class="mb-3" />

    <div class="d-flex justify-end gap-2">
      <v-btn
        size="small"
        variant="text"
        prepend-icon="mdi-pencil"
        @click="$emit('edit', service)"
      >
        Editar
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
})

function formatPrice(value) {
  return Number(value).toLocaleString('es-CO')
}
</script>

<style scoped>
.service-card {
  border-radius: 16px;
}
.gap-2 {
  gap: 8px;
}
</style>