<template>
  <v-data-table
    :headers="headers"
    :items="clients"
    :items-per-page="10"
  >
    <template #[`item.name`]='{ item }'>
      <div class="d-flex align-center ga-2">
        <v-avatar size="30" color="primary">
          <span class="text-caption">{{ initials(item.name) }}</span>
        </v-avatar>
        <span class="font-weight-medium">{{ item.name }}</span>
      </div>
    </template>

    <template #[`item.lastVisit`]='{ item }'>
      {{ item.lastVisit || '—' }}
    </template>

    <template #[`item.tags`]='{ item }'>
      <v-chip
        v-for="tag in (item.tags || []).slice(0, 2)"
        :key="tag"
        size="x-small"
        class="mr-1"
        variant="outlined"
      >
        {{ tag }}
      </v-chip>
    </template>

    <template #[`item.actions`]='{ item }'>
      <div class="d-flex ga-1 justify-end">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          @click="$emit('view', item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="$emit('edit', item)"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script setup>
defineProps({
  clients: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['edit', 'view'])

const headers = [
  { title: 'Cliente', key: 'name' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Ciudad', key: 'city' },
  { title: 'Última visita', key: 'lastVisit' },
  { title: 'Etiquetas', key: 'tags', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

function initials(name = '') {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>