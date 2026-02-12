<template>
  <div class="tenant-edit pa-6">
    <div class="mb-8 d-flex justify-space-between align-center">
      <div>
        <h1 class="text-h4 font-weight-bold">Editar Tenant</h1>
        <p class="text-body-2 text-grey">
          Actualiza información comercial y configuración del tenant.
        </p>
      </div>

      <v-chip :color="form.active ? 'success' : 'grey'" variant="flat">
        {{ form.active ? 'Activo' : 'Pausado' }}
      </v-chip>
    </div>

    <v-card class="pa-6 rounded-xl">
      <v-form ref="formRef" v-model="formValid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.business_name"
              label="Nombre del negocio *"
              variant="outlined"
              :rules="[rules.required]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.subdomain"
              label="Subdominio *"
              variant="outlined"
              :rules="[rules.required, rules.subdomain]"
              :suffix="`.${baseDomain}`"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.owner_name"
              label="Nombre del Propietario"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.owner_email"
              label="Email del Propietario"
              variant="outlined"
              :rules="[rules.email]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.plan_id"
              :items="planOptions"
              label="Plan"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.active"
              :items="statusOptions"
              label="Estado"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-caption text-medium-emphasis">Color principal</label>
            <v-text-field
              v-model="form.brand_colors.primary"
              variant="outlined"
              :rules="[rules.hexColor]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-caption text-medium-emphasis">Color secundario</label>
            <v-text-field
              v-model="form.brand_colors.secondary"
              variant="outlined"
              :rules="[rules.hexColor]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.settings.max_users"
              label="Máximo de Usuarios"
              type="number"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.settings.max_appointments"
              label="Máximo de Citas/Mes"
              type="number"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-end mt-2">
          <v-btn variant="text" class="mr-2" @click="goBack">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!formValid" @click="saveTenant">
            Guardar cambios
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '@/composables/useNotification'
import { getTenantById, updateTenant } from '@/services/tenant.service'

const route = useRoute()
const router = useRouter()
const { notify } = useNotification()

const formRef = ref(null)
const formValid = ref(false)
const saving = ref(false)
const baseDomain = ref('miagenda.com')

const planOptions = ['Trial', 'Pro', 'Pro Plus']
const statusOptions = [
  { title: 'Activo', value: true },
  { title: 'Pausado', value: false },
]

const form = ref({
  business_name: '',
  subdomain: '',
  owner_name: '',
  owner_email: '',
  owner_phone: '',
  plan_id: 'Pro',
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
  active: true,
})

const rules = {
  required: value => !!value || 'Campo requerido',
  email: value => !value || /.+@.+\..+/.test(value) || 'Email inválido',
  subdomain: value => !value || /^[a-z0-9-]+$/.test(value) || 'Solo letras minúsculas, números y guiones',
  hexColor: value => !value || /^#[0-9A-F]{6}$/i.test(value) || 'Color hex inválido (ej: #6366F1)',
}

async function loadTenant() {
  try {
    const tenantId = route.params.id
    const tenant = await getTenantById(tenantId)
    form.value = {
      ...form.value,
      ...tenant,
      brand_colors: {
        ...form.value.brand_colors,
        ...tenant.brand_colors,
      },
      settings: {
        ...form.value.settings,
        ...tenant.settings,
      },
    }
  } catch (error) {
    notify({
      type: 'error',
      message: error.message || 'No se pudo cargar el tenant',
    })
    router.push({ name: 'TenantsList' })
  }
}

async function saveTenant() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true

  try {
    await updateTenant(route.params.id, form.value)
    notify({
      type: 'success',
      message: 'Tenant actualizado correctamente',
    })
    router.push({ name: 'TenantsList' })
  } catch (error) {
    notify({
      type: 'error',
      message: error.message || 'No se pudo actualizar el tenant',
    })
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push({ name: 'TenantsList' })
}

onMounted(loadTenant)
</script>