<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Usuarios y permisos de plataforma
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Equipo interno que administra tenants, soporte y operaciones.
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-account-plus"
        @click="openCreate"
      >
        Nuevo usuario
      </v-btn>
    </div>

    <v-row class="mb-4">
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-card>
          <v-card-text>
            <div class="text-caption">
              Total
            </div>
            <div class="text-h5 font-weight-bold">
              {{ stats.total }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-card>
          <v-card-text>
            <div class="text-caption">
              Activos
            </div>
            <div class="text-h5 font-weight-bold text-success">
              {{ stats.active }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-card>
          <v-card-text>
            <div class="text-caption">
              Invitados
            </div>
            <div class="text-h5 font-weight-bold text-info">
              {{ stats.invited }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-card>
          <v-card-text>
            <div class="text-caption">
              Super Admin
            </div>
            <div class="text-h5 font-weight-bold text-primary">
              {{ stats.superAdmins }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mb-4">
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="5"
          >
            <v-text-field
              v-model="filters.search"
              label="Buscar por nombre o email"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="filters.role"
              :items="PLATFORM_ROLE_OPTIONS"
              label="Rol"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Estado"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-btn
              block
              variant="outlined"
              @click="clearFilters"
            >
              Limpiar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <PlatformUserTable
          :users="filteredUsers"
          :loading="loading"
          @edit="openEdit"
          @delete="onDelete"
          @permissions="openPermissions"
        />
      </v-card-text>
    </v-card>

    <PlatformUserFormModal
      v-model="formModal"
      :user="selectedUser"
      @save="onSave"
    />

    <v-dialog
      v-model="permissionsModal"
      max-width="640"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Permisos de {{ selectedUser?.name }}</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="permissionsModal = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <v-checkbox
            v-for="permission in PLATFORM_PERMISSION_OPTIONS"
            :key="permission.key"
            v-model="selectedPermissions"
            :label="permission.label"
            :value="permission.key"
            color="primary"
            hide-details
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn @click="permissionsModal = false">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="onSavePermissions"
          >
            Guardar permisos
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PlatformUserFormModal from '@/modules/platform/components/PlatformUserFormModal.vue'
import PlatformUserTable from '@/modules/platform/components/PlatformUserTable.vue'
import {
  PLATFORM_PERMISSION_OPTIONS,
  PLATFORM_ROLE_OPTIONS,
  usePlatformUsers,
} from '@/modules/platform/composables/usePlatformUsers'

const {
  loading,
  filters,
  stats,
  filteredUsers,
  loadUsers,
  saveUser,
  deleteUser,
  savePermissions,
  clearFilters,
} = usePlatformUsers()

const formModal = ref(false)
const permissionsModal = ref(false)
const selectedUser = ref(null)
const selectedPermissions = ref([])

const statusOptions = [
  { title: 'Activo', value: 'active' },
  { title: 'Invitado', value: 'invited' },
  { title: 'Suspendido', value: 'suspended' },
]

onMounted(loadUsers)

function openCreate() {
  selectedUser.value = null
  formModal.value = true
}

function openEdit(user) {
  selectedUser.value = user
  formModal.value = true
}

async function onSave(payload) {
  await saveUser(payload, selectedUser.value?.id || null)
  formModal.value = false
}

async function onDelete(user) {
  await deleteUser(user.id)
}

function openPermissions(user) {
  selectedUser.value = user
  selectedPermissions.value = [...(user.permissions || [])]
  permissionsModal.value = true
}

async function onSavePermissions() {
  if (!selectedUser.value) return

  await savePermissions(selectedUser.value.id, selectedPermissions.value)
  permissionsModal.value = false
}
</script>