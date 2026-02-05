<template>
  <v-navigation-drawer
    app
    permanent
    width="260"
    class="sidebar"
    :style="sidebarStyles"
  >
    <!-- Branding -->
    <!--<div class="pa-4 text-center">
      <h3 class="text-white font-weight-bold">
        {{ tenant.name }}
      </h3>
      <p class="text-caption text-grey-lighten-1 mt-1">
        {{ roleName }}
      </p>
    </div>-->
    <div class="pa-4 text-center branding">
    <router-link
      :to="homeRoute"
      class="branding-link"
    >
      <v-img
        :src="tenant.logo?.src"
        max-width="140"
        class="mx-auto mb-2"
        contain
      />
      <h3 class="text-white font-weight-bold">
        {{ tenant.name }}
      </h3>
    </router-link>

    <p class="text-caption text-grey-lighten-1 mt-1">
      {{ roleName }}
    </p>
  </div>

    <v-divider class="border-opacity-25" />

    <!-- Menu -->
    <v-list nav class="mt-2">
      <v-list-item
        v-for="item in menu"
        :key="item.title"
        :to="item.to"
        :exact="item.exact"
        router
        active-class="menu-active"
        class="menu-item"
      >
        <template #prepend v-if="item.icon">
          <v-icon :icon="item.icon" size="small" class="mr-3" />
        </template>
        
        <v-list-item-title class="text-body-2">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- User info & Logout -->
    <template #append>
      <div class="pa-4">
        <v-divider class="mb-4 border-opacity-25" />
        
        <div class="d-flex align-center mb-2">
          <v-avatar size="32" color="primary" class="mr-2">
            <span class="text-caption">{{ userInitials }}</span>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-caption text-white font-weight-medium">
              {{ userName }}
            </div>
            <div class="text-caption text-grey-lighten-1">
              {{ userEmail }}
            </div>
          </div>
        </div>

        <v-btn
          block
          variant="outlined"
          size="small"
          color="white"
          @click="handleLogout"
        >
          Cerrar sesión
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { SIDEBAR_MENU } from '@/config/sidebar.menu'
import { useTenant } from '@/composables/useTenant'
import { ROLES } from '@/constants/roles'

const router = useRouter()
const auth = useAuth()
const { tenant } = useTenant()

// Menú dinámico según rol
const menu = computed(() => {
  const role = auth.role.value
  if (!role) return[]

  const items = SIDEBAR_MENU[role] || []

  return items.filter(item => {
    if (!item.permission) return true
    return auth.hasPermission(item.permission)
  })
})

// Nombre del rol en español
const roleName = computed(() => {
  const roleNames = {
    [ROLES.SUPER_ADMIN]: 'Super Administrador',
    [ROLES.TENANT_ADMIN]: 'Administrador',
    [ROLES.STAFF]: 'Colaborador',
  }
  return roleNames[auth.role.value] || 'Usuario'
})
const homeRoute = computed(() => {
  return auth.isSuperAdmin.value ? '/platform' : '/app'
})

// Datos del usuario
const userName = computed(() => auth.state.user?.name || 'Usuario')
const userEmail = computed(() => auth.state.user?.email || '')
const userInitials = computed(() => {
  const name = auth.state.user?.name || 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Estilos dinámicos del sidebar
const sidebarStyles = computed(() => ({
  background: tenant.gradient || 'linear-gradient(180deg, #0f172a, #1e293b)',
}))

/**
 * Cerrar sesión
 */
function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  color: white;
}

.menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: translateX(4px);
  color: white;
}

.menu-active {
  background-color: rgba(255, 255, 255, 0.18) !important;
  font-weight: 600;
  color: white !important;
}

/* Animación suave */
.menu-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>