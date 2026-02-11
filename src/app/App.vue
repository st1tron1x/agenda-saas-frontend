<template>
  <v-app>
    <router-view />
    <NotificationContainer />
  </v-app>
</template>

<script setup>
import NotificationContainer from '../../src/components/ui/NotificationContainer.vue'
</script>