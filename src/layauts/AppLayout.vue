<template>
  <v-app>
    <v-layout>
      <!-- Sidebar -->
      <PlatformSidebar
        v-if="!isFullscreenRoute"
        v-model="drawerOpen"
      />

      <!-- Main -->
      <v-main>
        <!-- Top bar -->
        <v-app-bar
          v-if="!isFullscreenRoute"
          flat
          color="white"
          height="64"
          :class="isMobile ? 'px-2' : 'px-6'"
        >
          <v-app-bar-nav-icon
            v-if="isMobile"
            @click="drawerOpen = !drawerOpen"
          />

          <v-spacer />

          <!-- Indicador de impersonación -->
          <v-chip
            v-if="auth.state.isImpersonating"
            color="warning"
            variant="flat"
            size="small"
            prepend-icon="mdi-account-switch"
            :class="isMobile ? 'mr-2' : 'mr-4'"
            @click="exitImpersonation"
          >
            {{ isMobile ? 'Salir' : 'Modo impersonación (clic para salir)' }}
          </v-chip>

          <span class="text-caption">{{ roleName }}</span>
        </v-app-bar>

        <!-- Page content -->
        <v-container
          fluid
          :class="containerClass"
        >
          <router-view />
        </v-container>
      </v-main>
    </v-layout>

    <!-- Footer global -->
    <AppFooter v-if="!isFullscreenRoute" />
  </v-app>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { ROLES } from '@/constants/roles'
import PlatformSidebar from '@/components/PlatformSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const { mdAndDown } = useDisplay()
const isMobile = computed(() => mdAndDown.value)

const isFullscreenRoute = computed(() => Boolean(route.meta.fullscreen))

const drawerOpen = ref(!isMobile.value)

watch(
  [isMobile, isFullscreenRoute],
  ([mobile, fullscreen]) => {
    drawerOpen.value = fullscreen ? false : !mobile
  },
  { immediate: true }
)

const containerClass = computed(() => {
  if (isFullscreenRoute.value) return 'pa-0 fill-height'
  return isMobile.value ? 'pa-3' : 'pa-6'
})

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