<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Gestión de Tenants
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Administra clientes, estado operacional y plan comercial.
        </p>
      </div>

      <v-btn
        color="success"
        prepend-icon="mdi-plus"
        @click="goToCreate"
      >
        Nuevo Tenant
      </v-btn>
    </div>

    <!--Cards-->

    <v-row class="mb-4">
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-card>
          <v-card-text>
            <div class="text-caption">
              Total tenants
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
              Pausados
            </div>
            <div class="text-h5 font-weight-bold text-error">
              {{ stats.paused }}
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
              Plan más usado
            </div>
            <div class="text-h6 font-weight-bold">
              {{ stats.topPlan }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="5"
          >
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
          <v-col
            cols="12"
            md="3"
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
       
    <v-row class="mb-6">
      <v-col
        v-for="tenant in filteredTenants"
        :key="tenant.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="tenant-card h-100">
          <v-card-title class="d-flex align-center">
            <v-avatar 
              size="48" 
              class="mr-3"
            >
              <v-img :src="tenant.logo.src" />
            </v-avatar>

            <div class="flex-grow-1">
              <div class="font-weight-medium">
                {{ tenant.name }}
              </div>
              <div class="text-caption text-grey">
                {{ tenant.plan }}
              </div>
            </div>    

            <v-chip
              :color="tenant.active ? 'success' : 'grey'"
              size="small"
              variant="flat"
            >
              {{ tenant.active ? 'Activo' : 'Pausado' }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pt-0">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption text-medium-emphasis">Subdominio</span>
              <span class="text-caption">{{ tenant.subdomain }}</span>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption text-medium-emphasis">Usuarios</span>
              <span class="text-caption">{{ tenant.usersCount }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-caption text-medium-emphasis">MRR estimado</span>
              <span class="text-caption">US$ {{ tenant.mrr }}</span>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn 
              variant="text" 
              size="small"
              @click="editTenant(tenant)"
            >
              Editar
            </v-btn>
            <v-btn 
              variant="text" 
              size="small"
              @click="openSupport(tenant)"
            >
              Soporte
            </v-btn>
            
            <v-spacer />
            <v-btn 
              variant="text" 
              size="small" 
              color="primary" 
              @click="enterAsTenant(tenant)"
            >
              Entrar
            </v-btn>
            <v-btn
              variant="text"
              size="small"
              color="error"
              @click="toggleTenantStatus(tenant)"
            >
              {{ tenant.active ? 'Pausar' : 'Activar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { ROLES } from '@/constants/roles'
import { getTenants } from '@/services/tenant.service'

const tenants = ref([])
const router = useRouter()
const auth = useAuth()
const filters = ref({
  search: '',
  status: null,
  plan: null,
})

const statusOptions = [
  { title: 'Activo', value: 'active' },
  { title: 'Pausado', value: 'paused' },
]

const planOptions = computed(() => {
  const plans = [...new Set(tenants.value.map(tenant => tenant.plan))]
  return plans.map(plan => ({ title: plan, value: plan }))
})

const filteredTenants = computed(() => {
  return tenants.value.filter(tenant => {
    const status = tenant.active ? 'active' : 'paused'

    const bySearch = !filters.value.search
      || tenant.name.toLowerCase().includes(filters.value.search.toLowerCase())
      || tenant.subdomain.toLowerCase().includes(filters.value.search.toLowerCase())

    const byStatus = !filters.value.status || filters.value.status === status
    const byPlan = !filters.value.plan || filters.value.plan === tenant.plan

    return bySearch && byStatus && byPlan
  })
})

const stats = computed(() => {
  const active = tenants.value.filter(tenant => tenant.active).length
  const paused = tenants.value.length - active

  const plansFrequency = tenants.value.reduce((acc, tenant) => {
    acc[tenant.plan] = (acc[tenant.plan] || 0) + 1
    return acc
  }, {})

  const topPlan = Object.entries(plansFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  return {
    total: tenants.value.length,
    active,
    paused,
    topPlan,
  }
})

onMounted(async () => {
  tenants.value = await getTenants()
})

const goToCreate = () => {
  router.push('/platform/tenants/create')
}

function clearFilters() {
  filters.value = {
    search: '',
    status: null,
    plan: null,
  }
}
function enterAsTenant(tenant) {
  auth.impersonate({
    tenantId: tenant.id,
    role: ROLES.TENANT_ADMIN,
  })

  router.push('/app')
}
function editTenant(tenant) {
  router.push({ name: 'TenantEdit', params: { id: tenant.id } })
}

function openSupport(tenant) {
  router.push({
    path: '/platform/support',
    query: { tenantId: tenant.id },
  })
}

function toggleTenantStatus(tenant) {
  tenant.active = !tenant.active
}
</script>

<style scoped>
.tenant-card {
  transition: all 0.2s ease;
}

.tenant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
</style>
