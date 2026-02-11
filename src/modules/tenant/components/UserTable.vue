<template>
  <v-card>
    <v-table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th class="text-right">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <v-chip size="small" color="primary">
              {{ user.role }}
            </v-chip>
          </td>
          <td>
            <v-chip
              size="small"
              :color="user.active ? 'green' : 'red'"
            >
              {{ user.active ? 'Activo' : 'Inactivo' }}
            </v-chip>
          </td>
          <td class="text-right">
            <v-btn icon variant="text" @click="$emit('edit', user)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn icon variant="text" @click="$emit('permissions', user)">
              <v-icon>mdi-shield-key</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    required: true,
  },
})
defineEmits(['edit', 'permissions'])
</script>