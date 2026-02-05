<template>
  <v-navigation-drawer
    app
    permanent
    width="260"
    class="sidebar"
    :style="{ backgroundColor: tenant.primaryColor }"
  >
    <!-- Branding -->
    <div class="pa-4 text-center">
      <h3 class="font-weight-bold">
        {{ tenant.name }}
      </h3>
    </div>

    <v-divider />

    <!-- Menu -->
    <v-list nav>
      <v-list-item
        v-for="item in menu"
        :key="item.title"
        :to="item.to"
        :exact="item.exact"
        router
        active-class="menu-active"
        class="menu-item"        
      >
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>  
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { SIDEBAR_MENU } from '../config/sidebar.menu'
import { useTenant } from '../composables/useTenant'

const { role } = useAuth()
const { tenant } = useTenant()

const menu = computed(() => SIDEBAR_MENU[role] || [])
</script>

<style scoped>
.sidebar {
  background-color: #0f172a;
  color: white;
}

.menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: translateX(6px);
}
.menu-active {
  background-color: rgba(255, 255, 255, 0.18);
  font-weight: 600;
}
.sidebar {
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 1),
    rgba(15, 23, 42, 0.9)
  );
}
</style>
