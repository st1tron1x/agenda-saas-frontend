<template>
  <v-container fluid class="pa-6">
    <v-card class="pa-4 mb-4 d-flex justify-space-between">
      <div>
        <h2 class="text-h6 font-weight-bold">Usuarios</h2>
        <span class="text-caption text-grey">
          Administra los usuarios de tu equipo
        </span>
      </div>

      <v-btn color="primary" prepend-icon="mdi-account-plus" @click="openModal">
        Nuevo usuario
      </v-btn>
    </v-card>

    <UserTable
      :users="users"
      @edit="openEdit"
      @permissions="openPermissions"
    />

    <UserFormModal
      v-model="modalOpen"
      :user="selectedUser"
      @save="saveUser"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import UserTable from '@/modules/tenant/components/UserTable.vue'
import UserFormModal from '@/modules/tenant/components/UserFormModal.vue'

const users = ref([
  {
    id: 1,
    name: 'Laura Pérez',
    email: 'laura@tenant.com',
    role: 'ADMIN',
    active: true,
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    email: 'carlos@tenant.com',
    role: 'STAFF',
    active: true,
  },
])

const modalOpen = ref(false)
const selectedUser = ref(null)

function openModal() {
  selectedUser.value = null
  modalOpen.value = true
}

function openEdit(user) {
  selectedUser.value = user
  modalOpen.value = true
}

function openPermissions(user) {
  console.log('Permisos usuario', user.id)
}

function saveUser(data) {
  console.log('Guardar usuario', data)
}
</script>
