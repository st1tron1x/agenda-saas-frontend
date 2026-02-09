<template>
  <v-app>
    <v-layout>

      <!-- Sidebar -->
      <PlatformSidebar />

      <!-- Main -->
      <v-main>
        <!-- Top bar -->
        <v-app-bar
          flat
          color="white"
          height="64"
          class="px-6"
        >
          <v-spacer />
          
          <!-- Indicador de impersonación -->
          <v-chip
            v-if="auth.state.isImpersonating"
            color="warning"
            variant="flat"
            size="small"
            prepend-icon="mdi-account-switch"
            class="mr-4"
            @click="exitImpersonation"
          >
            Modo impersonación (clic para salir)
          </v-chip>

          <span class="text-caption">{{ roleName }}</span>
        </v-app-bar>

        <!-- Page content -->
        <v-container fluid class="pa-6">
          <router-view />
        </v-container>
      </v-main>

    </v-layout>

    <!-- Footer global -->
    <AppFooter />
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { ROLES } from '@/constants/roles'
import PlatformSidebar from '@/components/PlatformSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()
const auth = useAuth()

const roleName = computed(() => {
  const roleNames = {
    [ROLES.SUPER_ADMIN]: 'Super Administrador',
    [ROLES.TENANT_ADMIN]: 'Administrador',
    [ROLES.STAFF]: 'Colaborador',
  }
  return roleNames[auth.role.value] || 'Usuario'
})

function exitImpersonation() {
  auth.exitImpersonation()
  router.push('/platform')
}
</script>