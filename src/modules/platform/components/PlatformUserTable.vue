<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :loading="loading"
    :items-per-page="10"
  >
    <template #[`item.role`]="{ item }">
      <v-chip
        size="small"
        variant="tonal"
        color="primary"
      >
        {{ roleLabel(item.role) }}
      </v-chip>
    </template>

    <template #[`item.status`]="{ item }">
      <v-chip
        :color="statusColor(item.status)"
        size="small"
      >
        {{ statusLabel(item.status) }}
      </v-chip>
    </template>

    <template #[`item.permissions`]="{ item }">
      <v-chip
        size="small"
        variant="outlined"
      >
        {{ item.permissions?.length || 0 }} permisos
      </v-chip>
    </template>

    <template #[`item.lastLoginAt`]="{ item }">
      {{ item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString() : 'Sin acceso' }}
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="d-flex ga-1">
        <v-btn
          icon="mdi-shield-account"
          variant="text"
          size="small"
          @click="$emit('permissions', item)"
        />
        <v-btn
          icon="mdi-pencil"
          variant="text"
          size="small"
          @click="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete"
          variant="text"
          color="error"
          size="small"
          @click="$emit('delete', item)"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit', 'delete', 'permissions'])

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Estado', key: 'status' },
  { title: 'Permisos', key: 'permissions' },
  { title: 'Último acceso', key: 'lastLoginAt' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

function roleLabel(role) {
  const labels = {
    SUPER_ADMIN: 'Super Admin',
    TENANT_ADMIN_MANAGER: 'Admin tenants',
    SUPPORT_AGENT: 'Soporte',
  }
  return labels[role] || role
}

function statusLabel(status) {
  const labels = {
    active: 'Activo',
    invited: 'Invitado',
    suspended: 'Suspendido',
  }
  return labels[status] || status
}

function statusColor(status) {
  const colors = {
    active: 'success',
    invited: 'info',
    suspended: 'error',
  }
  return colors[status] || 'default'
}
</script>
 
EOF
)