<template>
  <v-card class="client-card pa-4" hover @click="$emit('select', client)">
    <v-avatar size="48" color="primary" class="mb-2">
      {{ initials }}
    </v-avatar>

    <div class="font-weight-medium">{{ client.name }}</div>
    <div class="text-caption text-grey">{{ client.phone }}</div>

    <v-divider class="my-2" />

    <div class="text-caption">
      Última visita:
      <strong>{{ client.lastVisit || '—' }}</strong>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  client: Object,
})

defineEmits(['select'])

const initials = computed(() =>
  props.client.name
    .split(' ')
    .map(n => n[0])
    .join('')
)
</script>

<style scoped>
.client-card {
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.client-card:hover {
  transform: translateY(-2px);
}
</style>