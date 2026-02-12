<template>
  <v-app>
    <v-layout>
      <!-- Sidebar -->
      <PlatformSidebar v-model="drawerOpen" />

      <!-- Main -->
      <v-main>
        <!-- Top bar -->
        <v-app-bar
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
          <span class="text-caption">Super Admin</span>
        </v-app-bar>

        <!-- Page content -->
        <v-container fluid :class="isMobile ? 'pa-3' : 'pa-6'">
          <router-view />
        </v-container>
      </v-main>
    </v-layout>

    <!-- Footer global -->
    <AppFooter />
  </v-app>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import PlatformSidebar from '../components/PlatformSidebar.vue'
import AppFooter from '../components/AppFooter.vue'

const { mdAndDown } = useDisplay()
const isMobile = computed(() => mdAndDown.value)
const drawerOpen = ref(!isMobile.value)

watch(isMobile, value => {
  drawerOpen.value = !value
})
</script>
