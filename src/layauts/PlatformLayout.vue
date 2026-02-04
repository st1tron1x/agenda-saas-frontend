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
          <span class="text-caption">Super Admin</span>
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
import PlatformSidebar from '../components/PlatformSidebar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
