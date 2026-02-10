<!-- src/views/tenant/UsersPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Gestión de Usuarios</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Administra el equipo y los permisos de acceso
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-account-plus"
        @click="openCreateDialog"
      >
        Nuevo Usuario
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Total Usuarios</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.total }}</h2>
              </div>
              <v-avatar color="primary" size="48">
                <v-icon>mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Admins</p>
                <h2 class="text-h4 font-weight-bold text-warning">{{ stats.admins }}</h2>
              </div>
              <v-avatar color="warning" size="48">
                <v-icon>mdi-shield-account</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Staff</p>
                <h2 class="text-h4 font-weight-bold text-success">{{ stats.staff }}</h2>
              </div>
              <v-avatar color="success" size="48">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Activos</p>
                <h2 class="text-h4 font-weight-bold text-info">{{ stats.active }}</h2>
              </div>
              <v-avatar color="info" size="48">
                <v-icon>mdi-check-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="filters.search"
              label="Buscar usuario"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.role"
              :items="roleOptions"
              label="Rol"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.status"
              :items="statusFilterOptions"
              label="Estado"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              block
              color="primary"
              variant="outlined"
              @click="clearFilters"
            >
              Limpiar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Users Table -->
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :loading="loading"
          :items-per-page="15"
        >
          <!-- Name -->
          <template #item.name="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar :color="item.is_active ? 'primary' : 'grey'" size="40" class="mr-3">
                <span class="text-white font-weight-bold">
                  {{ getInitials(item.name) }}
                </span>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <!-- Role -->
          <template #item.role="{ item }">
            <v-chip
              :color="getRoleColor(item.role)"
              :prepend-icon="getRoleIcon(item.role)"
              size="small"
            >
              {{ getRoleLabel(item.role) }}
            </v-chip>
          </template>

          <!-- Status -->
          <template #item.is_active="{ item }">
            <v-chip
              :color="item.is_active ? 'success' : 'grey'"
              size="small"
            >
              {{ item.is_active ? 'Activo' : 'Inactivo' }}
            </v-chip>
          </template>

          <!-- Last Login -->
          <template #item.last_login="{ item }">
            <span v-if="item.last_login" class="text-body-2">
              {{ formatDateTime(item.last_login) }}
            </span>
            <span v-else class="text-caption text-medium-emphasis">
              Nunca
            </span>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-tooltip text="Ver permisos">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-shield-lock"
                    size="small"
                    variant="text"
                    @click="viewPermissions(item)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Editar">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    @click="editUser(item)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip :text="item.is_active ? 'Desactivar' : 'Activar'">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :icon="item.is_active ? 'mdi-account-off' : 'mdi-account-check'"
                    size="small"
                    variant="text"
                    :color="item.is_active ? 'warning' : 'success'"
                    @click="toggleUserStatus(item)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Eliminar">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="deleteUser(item)"
                  />
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog.show" max-width="700" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ dialog.mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario' }}</span>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-6">
          <v-form ref="formRef" v-model="formValid">
            <v-row>
              <!-- Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Nombre Completo *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>

              <!-- Email -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Email *"
                  :rules="[rules.required, rules.email]"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  :disabled="dialog.mode === 'edit'"
                />
              </v-col>

              <!-- Phone -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone"
                  label="Teléfono"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                />
              </v-col>

              <!-- Role -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.role"
                  :items="roleOptions"
                  label="Rol *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-shield-account"
                />
              </v-col>

              <!-- Password (only for create) -->
              <v-col cols="12" v-if="dialog.mode === 'create'">
                <v-text-field
                  v-model="form.password"
                  label="Contraseña *"
                  :rules="dialog.mode === 'create' ? [rules.required, rules.minLength] : []"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                />
              </v-col>

              <!-- Active Status -->
              <v-col cols="12">
                <v-switch
                  v-model="form.is_active"
                  label="Usuario Activo"
                  color="success"
                  hide-details
                />
              </v-col>

              <!-- Role Description -->
              <v-col cols="12">
                <v-alert
                  type="info"
                  variant="tonal"
                  density="compact"
                >
                  <template #prepend>
                    <v-icon>mdi-information</v-icon>
                  </template>
                  {{ getRoleDescription(form.role) }}
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="!formValid"
            @click="saveUser"
          >
            {{ dialog.mode === 'create' ? 'Crear' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Permissions Dialog -->
    <v-dialog v-model="permissionsDialog.show" max-width="900">
      <v-card v-if="permissionsDialog.user">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <div class="text-h6">Permisos de {{ permissionsDialog.user.name }}</div>
            <div class="text-caption text-medium-emphasis">
              Rol: {{ getRoleLabel(permissionsDialog.user.role) }}
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="permissionsDialog.show = false" />
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-6">
          <v-alert
            type="info"
            variant="tonal"
            class="mb-6"
          >
            Los permisos se asignan automáticamente según el rol del usuario.
            Para cambiar los permisos, modifica el rol del usuario.
          </v-alert>

          <v-row>
            <v-col
              v-for="category in permissionCategories"
              :key="category.name"
              cols="12"
              md="6"
            >
              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1 d-flex align-center">
                  <v-icon :icon="category.icon" class="mr-2" />
                  {{ category.name }}
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="permission in category.permissions"
                      :key="permission.key"
                    >
                      <template #prepend>
                        <v-icon
                          :icon="hasPermission(permissionsDialog.user.role, permission.key) ? 'mdi-check-circle' : 'mdi-close-circle'"
                          :color="hasPermission(permissionsDialog.user.role, permission.key) ? 'success' : 'grey'"
                        />
                      </template>
                      <v-list-item-title>{{ permission.label }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn @click="permissionsDialog.show = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { notify } = useNotification()

// State
const loading = ref(false)
const saving = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const showPassword = ref(false)

const users = ref([])

const filters = ref({
  search: '',
  role: null,
  status: null,
})

const stats = ref({
  total: 0,
  admins: 0,
  staff: 0,
  active: 0,
})

const dialog = ref({
  show: false,
  mode: 'create', // 'create' | 'edit'
})

const permissionsDialog = ref({
  show: false,
  user: null,
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  role: 'staff',
  password: '',
  is_active: true,
})

// Table headers
const headers = [
  { title: 'Usuario', key: 'name', sortable: true },
  { title: 'Rol', key: 'role', sortable: true },
  { title: 'Teléfono', key: 'phone', sortable: false },
  { title: 'Estado', key: 'is_active', sortable: true },
  { title: 'Último Acceso', key: 'last_login', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

const roleOptions = [
  { title: 'Administrador', value: 'admin' },
  { title: 'Staff', value: 'staff' },
]

const statusFilterOptions = [
  { title: 'Activo', value: true },
  { title: 'Inactivo', value: false },
]

// Permission categories and definitions
const permissionCategories = ref([
  {
    name: 'Agenda y Citas',
    icon: 'mdi-calendar',
    permissions: [
      { key: 'appointments.view', label: 'Ver citas' },
      { key: 'appointments.create', label: 'Crear citas' },
      { key: 'appointments.edit', label: 'Editar citas' },
      { key: 'appointments.delete', label: 'Eliminar citas' },
    ],
  },
  {
    name: 'Clientes',
    icon: 'mdi-account-group',
    permissions: [
      { key: 'clients.view', label: 'Ver clientes' },
      { key: 'clients.create', label: 'Crear clientes' },
      { key: 'clients.edit', label: 'Editar clientes' },
      { key: 'clients.delete', label: 'Eliminar clientes' },
    ],
  },
  {
    name: 'Servicios',
    icon: 'mdi-clipboard-list',
    permissions: [
      { key: 'services.view', label: 'Ver servicios' },
      { key: 'services.create', label: 'Crear servicios' },
      { key: 'services.edit', label: 'Editar servicios' },
      { key: 'services.delete', label: 'Eliminar servicios' },
    ],
  },
  {
    name: 'Usuarios',
    icon: 'mdi-account-cog',
    permissions: [
      { key: 'users.view', label: 'Ver usuarios' },
      { key: 'users.create', label: 'Crear usuarios' },
      { key: 'users.edit', label: 'Editar usuarios' },
      { key: 'users.delete', label: 'Eliminar usuarios' },
    ],
  },
  {
    name: 'Reportes',
    icon: 'mdi-chart-bar',
    permissions: [
      { key: 'reports.revenue', label: 'Ver ingresos' },
      { key: 'reports.export', label: 'Exportar reportes' },
      { key: 'reports.analytics', label: 'Ver analíticas' },
    ],
  },
  {
    name: 'Configuración',
    icon: 'mdi-cog',
    permissions: [
      { key: 'settings.view', label: 'Ver configuración' },
      { key: 'settings.edit', label: 'Modificar configuración' },
      { key: 'settings.billing', label: 'Gestionar facturación' },
    ],
  },
])

// Role-based permissions matrix
const rolePermissions = {
  admin: [
    'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
    'clients.view', 'clients.create', 'clients.edit', 'clients.delete',
    'services.view', 'services.create', 'services.edit', 'services.delete',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'reports.revenue', 'reports.export', 'reports.analytics',
    'settings.view', 'settings.edit', 'settings.billing',
  ],
  staff: [
    'appointments.view', 'appointments.create', 'appointments.edit',
    'clients.view', 'clients.create', 'clients.edit',
    'services.view',
  ],
}

// Validation rules
const rules = {
  required: v => !!v || 'Campo requerido',
  email: v => !v || /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: v => !v || v.length >= 6 || 'Mínimo 6 caracteres',
}

// Computed
const filteredUsers = computed(() => {
  let result = users.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      u =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    )
  }

  if (filters.value.role) {
    result = result.filter(u => u.role === filters.value.role)
  }

  if (filters.value.status !== null) {
    result = result.filter(u => u.is_active === filters.value.status)
  }

  return result
})

// Methods
async function loadUsers() {
  loading.value = true
  try {
    // TODO: Replace with API call
    // const response = await api.get('/tenant/users')
    // users.value = response.data
    
    // Mock data
    users.value = [
      {
        id: 1,
        name: 'María González',
        email: 'maria@example.com',
        phone: '+57 300 123 4567',
        role: 'admin',
        is_active: true,
        last_login: '2024-02-10T10:30:00Z',
      },
      {
        id: 2,
        name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        phone: '+57 310 987 6543',
        role: 'staff',
        is_active: true,
        last_login: '2024-02-10T09:15:00Z',
      },
      {
        id: 3,
        name: 'Ana Martínez',
        email: 'ana@example.com',
        phone: '+57 320 555 7890',
        role: 'staff',
        is_active: true,
        last_login: '2024-02-09T16:45:00Z',
      },
      {
        id: 4,
        name: 'Laura Sánchez',
        email: 'laura@example.com',
        phone: '+57 315 444 1234',
        role: 'staff',
        is_active: false,
        last_login: null,
      },
    ]

    calculateStats()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al cargar usuarios',
    })
  } finally {
    loading.value = false
  }
}

function calculateStats() {
  stats.value = {
    total: users.value.length,
    admins: users.value.filter(u => u.role === 'admin').length,
    staff: users.value.filter(u => u.role === 'staff').length,
    active: users.value.filter(u => u.is_active).length,
  }
}

function openCreateDialog() {
  dialog.value = {
    show: true,
    mode: 'create',
  }
  resetForm()
}

function editUser(user) {
  dialog.value = {
    show: true,
    mode: 'edit',
  }
  form.value = { ...user }
}

function viewPermissions(user) {
  permissionsDialog.value = {
    show: true,
    user: user,
  }
}

async function saveUser() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (dialog.value.mode === 'create') {
      // TODO: Replace with API call
      // await api.post('/tenant/users', form.value)
      notify({
        type: 'success',
        message: 'Usuario creado exitosamente. Se ha enviado un email con las credenciales.',
      })
    } else {
      // TODO: Replace with API call
      // await api.put(`/tenant/users/${form.value.id}`, form.value)
      notify({
        type: 'success',
        message: 'Usuario actualizado exitosamente',
      })
    }
    
    closeDialog()
    await loadUsers()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al guardar usuario',
    })
  } finally {
    saving.value = false
  }
}

async function toggleUserStatus(user) {
  const action = user.is_active ? 'desactivar' : 'activar'
  if (!confirm(`¿Seguro que deseas ${action} a ${user.name}?`)) return

  try {
    // TODO: Replace with API call
    // await api.patch(`/tenant/users/${user.id}/toggle-status`)
    notify({
      type: 'success',
      message: `Usuario ${user.is_active ? 'desactivado' : 'activado'}`,
    })
    await loadUsers()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al cambiar estado del usuario',
    })
  }
}

async function deleteUser(user) {
  if (!confirm(`¿Seguro que deseas ELIMINAR a ${user.name}? Esta acción no se puede deshacer.`)) {
    return
  }

  try {
    // TODO: Replace with API call
    // await api.delete(`/tenant/users/${user.id}`)
    notify({
      type: 'success',
      message: 'Usuario eliminado',
    })
    await loadUsers()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al eliminar usuario',
    })
  }
}

function closeDialog() {
  dialog.value.show = false
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: '',
    is_active: true,
  }
  formRef.value?.resetValidation()
}

function clearFilters() {
  filters.value = {
    search: '',
    role: null,
    status: null,
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function getRoleColor(role) {
  const colors = {
    admin: 'warning',
    staff: 'success',
  }
  return colors[role] || 'grey'
}

function getRoleIcon(role) {
  const icons = {
    admin: 'mdi-shield-account',
    staff: 'mdi-account',
  }
  return icons[role] || 'mdi-account'
}

function getRoleLabel(role) {
  const labels = {
    admin: 'Administrador',
    staff: 'Staff',
  }
  return labels[role] || role
}

function getRoleDescription(role) {
  const descriptions = {
    admin: 'Acceso completo al sistema: puede gestionar usuarios, configuración, ver reportes financieros y administrar todos los módulos.',
    staff: 'Acceso limitado: puede ver y gestionar citas, clientes y servicios. No tiene acceso a usuarios, configuración ni reportes financieros.',
  }
  return descriptions[role] || ''
}

function hasPermission(role, permissionKey) {
  return rolePermissions[role]?.includes(permissionKey) || false
}

function formatDateTime(datetime) {
  return new Date(datetime).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>