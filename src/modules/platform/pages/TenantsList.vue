<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h5 font-weight-bold">Tenants</h1>

      <v-btn color="primary" prepend-icon="mdi-plus" @click="goToCreate">
        Crear Tenant
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="tenant in tenants"
        :key="tenant.id"
        cols="12"
        md="4"
      >
        <v-card class="tenant-card">
          <v-card-title class="d-flex align-center">
            <v-avatar size="48" class="mr-3">
              <v-img :src="tenant.logo.src" />
            </v-avatar>

            <div>
              <div class="font-weight-medium">{{ tenant.name }}</div>
              <div class="text-caption text-grey">
                {{ tenant.plan }}
              </div>
            </div>
          </v-card-title>

          <v-card-text>
            <v-chip
              :color="tenant.active ? 'success' : 'grey'"
              size="small"
              variant="flat"
            >
              {{ tenant.active ? 'Activo' : 'Pausado' }}
            </v-chip>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn variant="text" size="small">Editar</v-btn>
            <v-btn variant="text" size="small">Soporte</v-btn>
            <v-spacer />
            <v-btn
              variant="text"
              size="small"
              color="error"
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
/*const tenants = [
  {
    id: 1,
    name: 'Xiomi Esthetic',
    plan: 'Pro',
    active: true,
    logo: {
      src: '/Xiomy.png',
    },
  },
  {
    id: 2,
    name: 'Gloria Osorio Studio',
    plan: 'Pro Plus',
    active: true,
    logo: {
      src: '/GO STUDIO.png',
    },
  },
  {
    id: 3,
    name: 'Tech Solution',
    plan: 'Trial',
    active: false,
    logo: {
      src: '/tech SVJ.png',
    },
  },
]*/
import {ref, onMounted} from 'vue'
import { getTenants } from '@/services/tenant.service'

const tenants = ref([])

onMounted(async()=>{
  tenants.value =await getTenants()
})
import { useRouter } from 'vue-router'

const router = useRouter()
const goToCreate = () => {
  router.push('/platform/tenants/create')
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
