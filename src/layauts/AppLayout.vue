<template>
  <v-app>
    <v-layout>

      <!-- Sidebar Tenant -->
      <PlatformSidebar />

      <!-- Contenido principal -->
      <v-main>
        <!-- Top bar -->
        <v-app-bar
          flat
          height="64"
          :style="{ background: tenant.gradient }"
          class="px-6 text-white"
        >
          <v-avatar size="36" class="mr-3">
            <v-img :src="tenant.logo.src" />
          </v-avatar>

          <strong>{{ tenant.name }}</strong>

          <v-spacer />

          <span class="text-caption">
            {{ roleName }}
          </span>
        </v-app-bar>

        <!-- Vista -->
        <v-container fluid class="pa-6">
          <router-view />
        </v-container>
      </v-main>

    </v-layout>

    <AppFooter />
  </v-app>
</template>

<script setup>
import PlatformSidebar from '@/components/PlatformSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useTenant } from '@/composables/useTenant'
import { useAuth } from '@/stores/auth'
import { computed } from 'vue'
import { ROLES } from '@/constants/roles'

const { tenant } = useTenant()
const auth = useAuth()

const roleName = computed(() => {
  const map = {
    [ROLES.TENANT_ADMIN]: 'Administrador',
    [ROLES.STAFF]: 'Colaborador',
  }
  return map[auth.role.value] || 'Usuario'
})
</script>