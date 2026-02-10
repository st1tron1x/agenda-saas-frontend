<!--{
  id: UUID,
  name: string,
  slug: string,                // para subdominio o routing
  plan: 'trial' | 'pro' | 'enterprise',
  status: 'active' | 'paused' | 'suspended',

  branding: {
    logo: string,
    primaryColor: string,
    secondaryColor: string,
  },

  legal: {
    businessName: string,
    nit: string,
    legalRepresentative: string,
    address: string,
    phone: string,
    email: string,
    city: string,
    country: 'CO',
  },

  admin: {
    name: string,
    email: string,
  },

  createdAt,
  updatedAt
}
-->
<!--TenantCreate.vue-->
<!--TenantCreate.vue-->
<!--TenantCreate.vue-->
<template>
  <div class="tenant-create pa-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold">Crear nuevo Tenant</h1>
      <p class="text-body-2 text-grey">
        Registra un nuevo negocio dentro de la plataforma
      </p>
    </div>

    <v-row>
      <!-- FORM -->
      <v-col cols="12" md="7">
        <v-card class="pa-6 rounded-xl">
          <v-form ref="formRef" v-model="formValid">
            <!-- Business Name -->
            <v-text-field
              v-model="form.business_name"
              label="Nombre del negocio *"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-store"
              :rules="[rules.required]"
            />

            <!-- Subdomain -->
            <v-text-field
              v-model="form.subdomain"
              label="Subdominio *"
              variant="outlined"
              prepend-inner-icon="mdi-web"
              :rules="[rules.required, rules.subdomain]"
              hint="Solo letras minúsculas, números y guiones"
              persistent-hint
              :suffix="`.${baseDomain}`"
            />

            <!-- Owner Name -->
            <v-text-field
              v-model="form.owner_name"
              label="Nombre del Propietario *"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              :rules="[rules.required]"
            />

            <!-- Owner Email -->
            <v-text-field
              v-model="form.owner_email"
              label="Email del Propietario *"
              variant="outlined"
              type="email"
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.email]"
            />

            <!-- Owner Phone -->
            <v-text-field
              v-model="form.owner_phone"
              label="Teléfono del Propietario"
              variant="outlined"
              prepend-inner-icon="mdi-phone"
            />

            <!-- Plan -->
            <v-select
              v-model="form.plan_id"
              :items="availablePlans"
              item-title="name"
              item-value="id"
              label="Plan *"
              variant="outlined"
              prepend-inner-icon="mdi-package"
              :rules="[rules.required]"
            />

            <!-- Business Type -->
            <v-select
              v-model="form.business_type"
              label="Tipo de negocio"
              :items="businessTypes"
              variant="outlined"
              prepend-inner-icon="mdi-briefcase"
            />

            <!-- Branding Section -->
            <v-divider class="my-6" />
            
            <div class="mb-4">
              <h3 class="text-h6 font-weight-medium mb-2">
                <v-icon class="mr-2">mdi-palette</v-icon>
                Identidad Visual
              </h3>
              <p class="text-caption text-grey mb-4">
                Define los colores que representarán al negocio en el sistema
              </p>

              <!-- Primary Color -->
              <v-row>
                <v-col cols="12" md="6">
                  <div class="color-picker-wrapper">
                    <label class="text-subtitle-2 mb-2 d-block">
                      Color Principal *
                    </label>
                    <div class="d-flex align-center gap-3">
                      <div class="color-picker-container">
                        <input
                          v-model="form.brand_colors.primary"
                          type="color"
                          class="color-input"
                          @input="updatePrimaryColor"
                        />
                        <div 
                          class="color-preview"
                          :style="{ backgroundColor: form.brand_colors.primary }"
                        >
                          <v-icon size="20" color="white">mdi-palette</v-icon>
                        </div>
                      </div>
                      <v-text-field
                        v-model="form.brand_colors.primary"
                        variant="outlined"
                        density="compact"
                        placeholder="#6366F1"
                        :rules="[rules.required, rules.hexColor]"
                        hide-details
                      />
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="color-picker-wrapper">
                    <label class="text-subtitle-2 mb-2 d-block">
                      Color Secundario
                    </label>
                    <div class="d-flex align-center gap-3">
                      <div class="color-picker-container">
                        <input
                          v-model="form.brand_colors.secondary"
                          type="color"
                          class="color-input"
                        />
                        <div 
                          class="color-preview"
                          :style="{ backgroundColor: form.brand_colors.secondary }"
                        >
                          <v-icon size="20" color="white">mdi-palette</v-icon>
                        </div>
                      </div>
                      <v-text-field
                        v-model="form.brand_colors.secondary"
                        variant="outlined"
                        density="compact"
                        placeholder="#EC4899"
                        :rules="[rules.hexColor]"
                        hide-details
                      />
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- Preset Colors -->
              <div class="mt-4">
                <p class="text-caption text-grey mb-2">Paletas sugeridas:</p>
                <div class="color-presets">
                  <div
                    v-for="preset in colorPresets"
                    :key="preset.name"
                    class="color-preset-item"
                    @click="applyColorPreset(preset)"
                  >
                    <div class="preset-colors">
                      <div
                        class="preset-color"
                        :style="{ backgroundColor: preset.primary }"
                      />
                      <div
                        class="preset-color"
                        :style="{ backgroundColor: preset.secondary }"
                      />
                    </div>
                    <span class="text-caption">{{ preset.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <v-divider class="my-6" />

            <!-- Trial End Date -->
            <v-text-field
              v-model="form.trial_end_date"
              label="Fin del Período de Prueba"
              type="date"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
            />

            <!-- Address -->
            <v-textarea
              v-model="form.address"
              label="Dirección"
              variant="outlined"
              rows="2"
              prepend-inner-icon="mdi-map-marker"
            />

            <!-- Advanced Settings -->
            <v-expansion-panels variant="accordion" class="mb-4">
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
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="form.settings.max_appointments"
                        label="Máximo de Citas/Mes"
                        type="number"
                        variant="outlined"
                        hint="Dejar vacío para ilimitado"
                        persistent-hint
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

            <v-divider class="my-6" />

            <!-- Actions -->
            <div class="d-flex justify-end">
              <v-btn 
                variant="text" 
                class="mr-3"
                @click="goBack"
              >
                Cancelar
              </v-btn>
              <v-btn 
                color="primary"
                :loading="saving"
                :disabled="!formValid"
                @click="createTenant"
              >
                Crear Tenant
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <!-- VISUAL / INSIGHT -->
      <v-col cols="12" md="5">
        <!-- Preview Card -->
        <v-card
          class="pa-6 rounded-xl insight-card mb-4"
          elevation="0"
        >
          <h3 class="text-h6 font-weight-medium mb-4">
            Vista Previa del Sidebar
          </h3>

          <p class="text-body-2 mb-4">
            Así se verá el sidebar con los colores seleccionados:
          </p>

          <!-- Sidebar Preview -->
          <div class="sidebar-preview" :style="{ backgroundColor: form.brand_colors.primary }">
            <div class="sidebar-header">
              <div class="logo-placeholder">
                <v-icon color="white" size="32">mdi-store</v-icon>
              </div>
              <div class="business-name">
                {{ form.business_name || 'Mi Negocio' }}
              </div>
            </div>

            <div class="sidebar-menu">
              <div class="menu-item active" :style="{ backgroundColor: lightenColor(form.brand_colors.primary, 20) }">
                <v-icon color="white" size="20">mdi-view-dashboard</v-icon>
                <span>Dashboard</span>
              </div>
              <div class="menu-item">
                <v-icon color="white" size="20">mdi-calendar</v-icon>
                <span>Calendario</span>
              </div>
              <div class="menu-item">
                <v-icon color="white" size="20">mdi-account-group</v-icon>
                <span>Clientes</span>
              </div>
              <div class="menu-item" :style="{ borderLeftColor: form.brand_colors.secondary }">
                <v-icon :color="form.brand_colors.secondary" size="20">mdi-clipboard-list</v-icon>
                <span>Servicios</span>
              </div>
            </div>

            <div class="sidebar-footer">
              <div class="accent-bar" :style="{ backgroundColor: form.brand_colors.secondary }" />
            </div>
          </div>
        </v-card>

        <!-- Stats Card -->
        <v-card class="pa-6 rounded-xl mb-4" elevation="1">
          <h3 class="text-h6 font-weight-medium mb-4">
            Información del Tenant
          </h3>

          <div class="stats-preview">
            <div class="stat-item">
              <v-icon color="primary" class="mr-2">mdi-domain</v-icon>
              <div>
                <div class="text-caption text-grey">Subdominio</div>
                <div class="text-body-1 font-weight-medium">
                  {{ form.subdomain || 'mi-negocio' }}.{{ baseDomain }}
                </div>
              </div>
            </div>

            <div class="stat-item">
              <v-icon color="success" class="mr-2">mdi-account-group</v-icon>
              <div>
                <div class="text-caption text-grey">Límite de usuarios</div>
                <div class="text-body-1 font-weight-medium">
                  {{ form.settings.max_users || 'Ilimitado' }}
                </div>
              </div>
            </div>

            <div class="stat-item">
              <v-icon color="info" class="mr-2">mdi-calendar-clock</v-icon>
              <div>
                <div class="text-caption text-grey">Citas mensuales</div>
                <div class="text-body-1 font-weight-medium">
                  {{ form.settings.max_appointments || 'Ilimitado' }}
                </div>
              </div>
            </div>

            <div class="stat-item">
              <v-icon :color="form.brand_colors.primary" class="mr-2">mdi-palette</v-icon>
              <div>
                <div class="text-caption text-grey">Color principal</div>
                <div class="d-flex align-center gap-2">
                  <div 
                    class="color-dot"
                    :style="{ backgroundColor: form.brand_colors.primary }"
                  />
                  <span class="text-body-2 font-weight-medium">
                    {{ form.brand_colors.primary }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </v-card>

        <!-- Quick Tips Card -->
        <v-card class="pa-6 rounded-xl" elevation="1">
          <h4 class="text-subtitle-1 font-weight-medium mb-3">
            💡 Consejos rápidos
          </h4>
          <v-list density="compact">
            <v-list-item 
              prepend-icon="mdi-check-circle"
              class="text-caption"
            >
              El subdominio no puede cambiarse después
            </v-list-item>
            <v-list-item 
              prepend-icon="mdi-check-circle"
              class="text-caption"
            >
              Los colores afectan sidebar, botones y elementos clave
            </v-list-item>
            <v-list-item 
              prepend-icon="mdi-check-circle"
              class="text-caption"
            >
              El propietario recibirá un email de bienvenida
            </v-list-item>
            <v-list-item 
              prepend-icon="mdi-check-circle"
              class="text-caption"
            >
              Los colores pueden modificarse después en configuración
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { notify } = useNotification()

// State
const formRef = ref(null)
const formValid = ref(false)
const saving = ref(false)
const baseDomain = ref('miagenda.com')
const availablePlans = ref([])

const businessTypes = [
  'Estética / Belleza',
  'Salud',
  'Wellness',
  'Consultorio',
  'Fisioterapia',
  'Micropigmentación',
  'Otro',
]

// Color Presets
const colorPresets = [
  {
    name: 'Indigo',
    primary: '#6366F1',
    secondary: '#EC4899',
  },
  {
    name: 'Elegante',
    primary: '#1F2937',
    secondary: '#F59E0B',
  },
  {
    name: 'Spa',
    primary: '#059669',
    secondary: '#10B981',
  },
  {
    name: 'Rosa',
    primary: '#EC4899',
    secondary: '#F472B6',
  },
  {
    name: 'Azul',
    primary: '#3B82F6',
    secondary: '#60A5FA',
  },
  {
    name: 'Púrpura',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
  },
  {
    name: 'Coral',
    primary: '#F43F5E',
    secondary: '#FB923C',
  },
  {
    name: 'Turquesa',
    primary: '#06B6D4',
    secondary: '#14B8A6',
  },
]

const form = ref({
  business_name: '',
  subdomain: '',
  owner_name: '',
  owner_email: '',
  owner_phone: '',
  plan_id: null,
  business_type: '',
  trial_end_date: '',
  address: '',
  brand_colors: {
    primary: '#6366F1',
    secondary: '#EC4899',
  },
  settings: {
    max_users: null,
    max_appointments: null,
    custom_domain_enabled: false,
    api_access_enabled: false,
  },
})

// Validation rules
const rules = {
  required: v => !!v || 'Campo requerido',
  email: v => !v || /.+@.+\..+/.test(v) || 'Email inválido',
  subdomain: v => !v || /^[a-z0-9-]+$/.test(v) || 'Solo letras minúsculas, números y guiones',
  hexColor: v => !v || /^#[0-9A-F]{6}$/i.test(v) || 'Color hex inválido (ej: #6366F1)',
}

// Methods
function applyColorPreset(preset) {
  form.value.brand_colors.primary = preset.primary
  form.value.brand_colors.secondary = preset.secondary
  
  notify({
    type: 'success',
    message: `Paleta "${preset.name}" aplicada`,
  })
}

function updatePrimaryColor() {
  // Aquí podrías agregar lógica adicional si necesitas
  // generar automáticamente el color secundario basado en el primario
}

function lightenColor(color, percent) {
  // Función para aclarar un color hex
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)
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

async function createTenant() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    // TODO: Replace with API call
    // await api.post('/platform/tenants', form.value)
    
    console.log('Datos del tenant a crear:', form.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    notify({
      type: 'success',
      message: 'Tenant creado exitosamente',
    })
    
    // Redirect to tenants list
    router.push({ name: 'platform-tenants' })
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al crear tenant',
    })
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push({ name: 'platform-tenants' })
}

// Lifecycle
onMounted(() => {
  loadPlans()
  
  // Set default trial end date (30 days from now)
  const trialEndDate = new Date()
  trialEndDate.setDate(trialEndDate.getDate() + 30)
  form.value.trial_end_date = trialEndDate.toISOString().split('T')[0]
})
</script>

<style scoped>
.tenant-create {
  background-color: #f8fafc;
  min-height: 100vh;
}

.insight-card {
  background: linear-gradient(135deg, #f3e8ff, #fdf4ff);
}

.stats-preview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
}

/* Color Picker Styles */
.color-picker-wrapper {
  margin-bottom: 16px;
}

.color-picker-container {
  position: relative;
  width: 56px;
  height: 56px;
}

.color-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.color-preview {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 3px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.gap-3 {
  gap: 12px;
}

/* Color Presets */
.color-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.color-preset-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.preset-colors {
  display: flex;
  gap: 4px;
}

.preset-color {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Sidebar Preview */
.sidebar-preview {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 320px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-placeholder {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.business-name {
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
}

.sidebar-menu {
  flex: 1;
  padding: 16px 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  cursor: pointer;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
  font-weight: 600;
}

.sidebar-footer {
  padding: 16px;
}

.accent-bar {
  height: 4px;
  border-radius: 2px;
}

/* Spacing between form fields */
.v-text-field,
.v-select,
.v-textarea {
  margin-bottom: 16px;
}
</style>