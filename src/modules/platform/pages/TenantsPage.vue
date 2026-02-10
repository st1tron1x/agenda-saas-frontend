<!-- src/views/platform/TenantsPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Gestión de Tenants</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Administra todas las instancias de clientes del sistema
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        Nuevo Tenant
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Total Tenants</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.total }}</h2>
              </div>
              <v-avatar color="primary" size="48">
                <v-icon>mdi-domain</v-icon>
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
                <h2 class="text-h4 font-weight-bold text-success">{{ stats.active }}</h2>
              </div>
              <v-avatar color="success" size="48">
                <v-icon>mdi-check-circle</v-icon>
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
                <p class="text-caption text-medium-emphasis mb-1">En Prueba</p>
                <h2 class="text-h4 font-weight-bold text-warning">{{ stats.trial }}</h2>
              </div>
              <v-avatar color="warning" size="48">
                <v-icon>mdi-clock-outline</v-icon>
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
                <p class="text-caption text-medium-emphasis mb-1">Suspendidos</p>
                <h2 class="text-h4 font-weight-bold text-error">{{ stats.suspended }}</h2>
              </div>
              <v-avatar color="error" size="48">
                <v-icon>mdi-alert-circle</v-icon>
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
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.search"
              label="Buscar tenant"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
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
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.plan"
              :items="planOptions"
              label="Plan"
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

    <!-- Tenants Table -->
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredTenants"
          :loading="loading"
          :items-per-page="10"
        >
          <!-- Subdomain -->
          <template #item.subdomain="{ item }">
            <div class="d-flex align-center">
              <v-chip
                size="small"
                variant="outlined"
                color="primary"
                prepend-icon="mdi-web"
              >
                {{ item.subdomain }}
              </v-chip>
            </div>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
            >
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </template>

          <!-- Plan -->
          <template #item.plan="{ item }">
            <div class="d-flex align-center">
              <v-icon
                :color="getPlanColor(item.plan.name)"
                size="small"
                class="mr-2"
              >
                {{ getPlanIcon(item.plan.name) }}
              </v-icon>
              <span class="font-weight-medium">{{ item.plan.name }}</span>
            </div>
          </template>

          <!-- Created At -->
          <template #item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>

          <!-- Users Count -->
          <template #item.users_count="{ item }">
            <v-chip size="small" variant="outlined">
              {{ item.users_count }} usuarios
            </v-chip>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-tooltip text="Ver detalles">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    @click="viewTenant(item)"
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
                    @click="editTenant(item)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Suspender" v-if="item.status === 'active'">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-pause-circle"
                    size="small"
                    variant="text"
                    color="warning"
                    @click="suspendTenant(item)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Activar" v-if="item.status === 'suspended'">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-play-circle"
                    size="small"
                    variant="text"
                    color="success"
                    @click="activateTenant(item)"
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
                    @click="deleteTenant(item)"
                  />
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog.show" max-width="800" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ dialog.mode === 'create' ? 'Nuevo Tenant' : 'Editar Tenant' }}</span>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-6">
          <v-form ref="formRef" v-model="formValid">
            <v-row>
              <!-- Business Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.business_name"
                  label="Nombre del Negocio *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-store"
                />
              </v-col>

              <!-- Subdomain -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.subdomain"
                  label="Subdominio *"
                  :rules="[rules.required, rules.subdomain]"
                  variant="outlined"
                  prepend-inner-icon="mdi-web"
                  hint="Solo letras minúsculas, números y guiones"
                  persistent-hint
                  :suffix="`.${baseDomain}`"
                />
              </v-col>

              <!-- Owner Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.owner_name"
                  label="Nombre del Propietario *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>

              <!-- Owner Email -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.owner_email"
                  label="Email del Propietario *"
                  :rules="[rules.required, rules.email]"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  type="email"
                />
              </v-col>

              <!-- Owner Phone -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.owner_phone"
                  label="Teléfono del Propietario"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                />
              </v-col>

              <!-- Plan -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.plan_id"
                  :items="availablePlans"
                  item-title="name"
                  item-value="id"
                  label="Plan *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-package"
                />
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="6" v-if="dialog.mode === 'edit'">
                <v-select
                  v-model="form.status"
                  :items="statusOptions"
                  label="Estado *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-information"
                />
              </v-col>

              <!-- Trial End Date -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.trial_end_date"
                  label="Fin del Período de Prueba"
                  type="date"
                  variant="outlined"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>

              <!-- Address -->
              <v-col cols="12">
                <v-textarea
                  v-model="form.address"
                  label="Dirección"
                  variant="outlined"
                  rows="2"
                  prepend-inner-icon="mdi-map-marker"
                />
              </v-col>

              <!-- Settings -->
              <v-col cols="12">
                <v-expansion-panels variant="accordion">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <template #default="{ expanded }">
                        <v-icon class="mr-3">
                          {{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                        Configuración Adicional (Opcional)
                      </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model.number="form.settings.max_users"
                            label="Máximo de Usuarios"
                            type="number"
                            variant="outlined"
                            hint="Dejar vacío para ilimitado"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model.number="form.settings.max_appointments"
                            label="Máximo de Citas/Mes"
                            type="number"
                            variant="outlined"
                            hint="Dejar vacío para ilimitado"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-switch
                            v-model="form.settings.custom_domain_enabled"
                            label="Permitir Dominio Personalizado"
                            color="primary"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-switch
                            v-model="form.settings.api_access_enabled"
                            label="Acceso a API"
                            color="primary"
                            hide-details
                          />
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
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
            @click="saveTenant"
          >
            {{ dialog.mode === 'create' ? 'Crear' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Details Dialog -->
    <v-dialog v-model="viewDialog.show" max-width="900">
      <v-card v-if="viewDialog.tenant">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Detalles del Tenant</span>
          <v-btn icon="mdi-close" variant="text" @click="viewDialog.show = false" />
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-6">
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <p class="text-caption text-medium-emphasis">Negocio</p>
                <p class="text-h6">{{ viewDialog.tenant.business_name }}</p>
              </div>
              <div class="mb-4">
                <p class="text-caption text-medium-emphasis">Subdominio</p>
                <v-chip color="primary" variant="outlined">
                  {{ viewDialog.tenant.subdomain }}.{{ baseDomain }}
                </v-chip>
              </div>
              <div class="mb-4">
                <p class="text-caption text-medium-emphasis">Estado</p>
                <v-chip :color="getStatusColor(viewDialog.tenant.status)">
                  {{ getStatusLabel(viewDialog.tenant.status) }}
                </v-chip>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="mb-4">
                <p class="text-caption text-medium-emphasis">Plan</p>
                <p class="text-h6">{{ viewDialog.tenant.plan.name }}</p>
              </div>
              <div class="mb-4">
                <p class="text-caption text-medium-emphasis">Propietario</p>
                <p class="text-body-1">{{ viewDialog.tenant.owner_name }}</p>
                <p class="text-caption">{{ viewDialog.tenant.owner_email }}</p>
              </div>
              <div class="mb-4">
                <p class="text-caption text-medium-emphasis">Creado</p>
                <p class="text-body-1">{{ formatDate(viewDialog.tenant.created_at) }}</p>
              </div>
            </v-col>

            <v-col cols="12">
              <v-divider class="my-4" />
              <h3 class="text-h6 mb-4">Estadísticas</h3>
              <v-row>
                <v-col cols="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-h4 font-weight-bold text-primary">
                        {{ viewDialog.tenant.stats.users }}
                      </div>
                      <div class="text-caption text-medium-emphasis">Usuarios</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-h4 font-weight-bold text-success">
                        {{ viewDialog.tenant.stats.clients }}
                      </div>
                      <div class="text-caption text-medium-emphasis">Clientes</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-h4 font-weight-bold text-info">
                        {{ viewDialog.tenant.stats.appointments }}
                      </div>
                      <div class="text-caption text-medium-emphasis">Citas/Mes</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-h4 font-weight-bold text-warning">
                        {{ viewDialog.tenant.stats.services }}
                      </div>
                      <div class="text-caption text-medium-emphasis">Servicios</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
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
const baseDomain = ref('miagenda.com')

const tenants = ref([])
const availablePlans = ref([])

const filters = ref({
  search: '',
  status: null,
  plan: null,
})

const stats = ref({
  total: 0,
  active: 0,
  trial: 0,
  suspended: 0,
})

const dialog = ref({
  show: false,
  mode: 'create', // 'create' | 'edit'
})

const viewDialog = ref({
  show: false,
  tenant: null,
})

const form = ref({
  business_name: '',
  subdomain: '',
  owner_name: '',
  owner_email: '',
  owner_phone: '',
  plan_id: null,
  status: 'active',
  trial_end_date: '',
  address: '',
  settings: {
    max_users: null,
    max_appointments: null,
    custom_domain_enabled: false,
    api_access_enabled: false,
  },
})

// Table headers
const headers = [
  { title: 'Negocio', key: 'business_name', sortable: true },
  { title: 'Subdominio', key: 'subdomain', sortable: true },
  { title: 'Estado', key: 'status', sortable: true },
  { title: 'Plan', key: 'plan', sortable: true },
  { title: 'Usuarios', key: 'users_count', sortable: true },
  { title: 'Creado', key: 'created_at', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

const statusOptions = [
  { title: 'Activo', value: 'active' },
  { title: 'En Prueba', value: 'trial' },
  { title: 'Suspendido', value: 'suspended' },
  { title: 'Cancelado', value: 'cancelled' },
]

const planOptions = computed(() => 
  availablePlans.value.map(p => ({ title: p.name, value: p.id }))
)

// Validation rules
const rules = {
  required: v => !!v || 'Campo requerido',
  email: v => !v || /.+@.+\..+/.test(v) || 'Email inválido',
  subdomain: v => !v || /^[a-z0-9-]+$/.test(v) || 'Solo letras minúsculas, números y guiones',
}

// Computed
const filteredTenants = computed(() => {
  let result = tenants.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      t =>
        t.business_name.toLowerCase().includes(search) ||
        t.subdomain.toLowerCase().includes(search) ||
        t.owner_email.toLowerCase().includes(search)
    )
  }

  if (filters.value.status) {
    result = result.filter(t => t.status === filters.value.status)
  }

  if (filters.value.plan) {
    result = result.filter(t => t.plan.id === filters.value.plan)
  }

  return result
})

// Methods
async function loadTenants() {
  loading.value = true
  try {
    // TODO: Replace with API call
    // const response = await api.get('/platform/tenants')
    // tenants.value = response.data
    
    // Mock data
    tenants.value = [
      {
        id: 1,
        business_name: 'Belleza Total',
        subdomain: 'belleza-total',
        status: 'active',
        owner_name: 'María González',
        owner_email: 'maria@belleza-total.com',
        owner_phone: '+57 300 123 4567',
        plan: { id: 2, name: 'Profesional' },
        users_count: 5,
        created_at: '2024-01-15T10:00:00Z',
        address: 'Calle 123 #45-67, Bogotá',
        stats: {
          users: 5,
          clients: 128,
          appointments: 45,
          services: 12,
        },
      },
      {
        id: 2,
        business_name: 'Estética Premium',
        subdomain: 'estetica-premium',
        status: 'trial',
        owner_name: 'Laura Martínez',
        owner_email: 'laura@estetica-premium.com',
        owner_phone: '+57 310 987 6543',
        plan: { id: 1, name: 'Básico' },
        users_count: 2,
        created_at: '2024-02-01T14:30:00Z',
        address: 'Carrera 7 #80-45, Bogotá',
        stats: {
          users: 2,
          clients: 45,
          appointments: 18,
          services: 8,
        },
      },
    ]

    calculateStats()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al cargar tenants',
    })
  } finally {
    loading.value = false
  }
}

async function loadPlans() {
  try {
    // TODO: Replace with API call
    // const response = await api.get('/platform/plans')
    // availablePlans.value = response.data
    
    // Mock data
    availablePlans.value = [
      { id: 1, name: 'Básico' },
      { id: 2, name: 'Profesional' },
      { id: 3, name: 'Empresarial' },
    ]
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al cargar planes',
    })
  }
}

function calculateStats() {
  stats.value = {
    total: tenants.value.length,
    active: tenants.value.filter(t => t.status === 'active').length,
    trial: tenants.value.filter(t => t.status === 'trial').length,
    suspended: tenants.value.filter(t => t.status === 'suspended').length,
  }
}

function openCreateDialog() {
  dialog.value = {
    show: true,
    mode: 'create',
  }
  resetForm()
}

function editTenant(tenant) {
  dialog.value = {
    show: true,
    mode: 'edit',
  }
  form.value = {
    ...tenant,
    plan_id: tenant.plan.id,
    settings: tenant.settings || {
      max_users: null,
      max_appointments: null,
      custom_domain_enabled: false,
      api_access_enabled: false,
    },
  }
}

function viewTenant(tenant) {
  viewDialog.value = {
    show: true,
    tenant: tenant,
  }
}

async function saveTenant() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (dialog.value.mode === 'create') {
      // TODO: Replace with API call
      // await api.post('/platform/tenants', form.value)
      notify({
        type: 'success',
        message: 'Tenant creado exitosamente',
      })
    } else {
      // TODO: Replace with API call
      // await api.put(`/platform/tenants/${form.value.id}`, form.value)
      notify({
        type: 'success',
        message: 'Tenant actualizado exitosamente',
      })
    }
    
    closeDialog()
    await loadTenants()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al guardar tenant',
    })
  } finally {
    saving.value = false
  }
}

async function suspendTenant(tenant) {
  if (!confirm(`¿Seguro que deseas suspender a ${tenant.business_name}?`)) return

  try {
    // TODO: Replace with API call
    // await api.post(`/platform/tenants/${tenant.id}/suspend`)
    notify({
      type: 'success',
      message: 'Tenant suspendido',
    })
    await loadTenants()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al suspender tenant',
    })
  }
}

async function activateTenant(tenant) {
  try {
    // TODO: Replace with API call
    // await api.post(`/platform/tenants/${tenant.id}/activate`)
    notify({
      type: 'success',
      message: 'Tenant activado',
    })
    await loadTenants()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al activar tenant',
    })
  }
}

async function deleteTenant(tenant) {
  if (!confirm(`¿Seguro que deseas ELIMINAR a ${tenant.business_name}? Esta acción no se puede deshacer.`)) {
    return
  }

  try {
    // TODO: Replace with API call
    // await api.delete(`/platform/tenants/${tenant.id}`)
    notify({
      type: 'success',
      message: 'Tenant eliminado',
    })
    await loadTenants()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al eliminar tenant',
    })
  }
}

function closeDialog() {
  dialog.value.show = false
  resetForm()
}

function resetForm() {
  form.value = {
    business_name: '',
    subdomain: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    plan_id: null,
    status: 'active',
    trial_end_date: '',
    address: '',
    settings: {
      max_users: null,
      max_appointments: null,
      custom_domain_enabled: false,
      api_access_enabled: false,
    },
  }
  formRef.value?.resetValidation()
}

function clearFilters() {
  filters.value = {
    search: '',
    status: null,
    plan: null,
  }
}

function getStatusColor(status) {
  const colors = {
    active: 'success',
    trial: 'warning',
    suspended: 'error',
    cancelled: 'grey',
  }
  return colors[status] || 'grey'
}

function getStatusLabel(status) {
  const labels = {
    active: 'Activo',
    trial: 'En Prueba',
    suspended: 'Suspendido',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}

function getPlanColor(planName) {
  const colors = {
    'Básico': 'info',
    'Profesional': 'primary',
    'Empresarial': 'purple',
  }
  return colors[planName] || 'grey'
}

function getPlanIcon(planName) {
  const icons = {
    'Básico': 'mdi-star-outline',
    'Profesional': 'mdi-star',
    'Empresarial': 'mdi-diamond-stone',
  }
  return icons[planName] || 'mdi-package'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Lifecycle
onMounted(() => {
  loadTenants()
  loadPlans()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>