<template>
  <v-app>
    <v-layout>

      <!-- Sidebar -->
      <v-navigation-drawer
        app
        permanent
        width="260"
        class="sidebar"
      >
        <div class="pa-4 text-center">
          <h3 class="font-weight-bold">Agenda SaaS</h3>
        </div>

        <v-divider />

        <v-list nav>
          <v-list-item
            v-for="item in menu"
            :key="item.title"
            :to="item.to"
            router
            class="menu-item"
          >
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main content -->
      <v-main>
        <v-app-bar
          flat
          color="white"
          height="64"
          class="px-6"
        >
          <v-spacer />
          <span class="text-caption">Super Admin</span>
        </v-app-bar>

        <v-container fluid class="pa-6">
          <router-view />
        </v-container>
      </v-main>

    </v-layout>
  </v-app>
</template>

<script setup>
const menu = [
  { title: 'Dashboard', to: '/platform' },
  { title: 'Tenants', to: '/platform/tenants' },
]
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
</style>