<!-- src/components/NotificationContainer.vue -->
<template>
  <v-snackbar
    v-for="notification in notifications"
    :key="notification.id"
    v-model="notification.visible"
    :color="getColor(notification.type)"
    :timeout="3000"
    location="top right"
    class="notification-snackbar"
  >
    <div class="d-flex align-center">
      <v-icon :icon="getIcon(notification.type)" class="mr-3" />
      
      <div>
        <div v-if="notification.title" class="font-weight-bold mb-1">
          {{ notification.title }}
        </div>
        <div>{{ notification.message }}</div>
      </div>
    </div>

    <template #actions>
      <v-btn
        icon
        size="small"
        variant="text"
        @click="remove(notification.id)"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'

const { notifications, remove } = useNotification()

function getColor(type) {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  return colors[type] || 'info'
}

function getIcon(type) {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information',
  }
  return icons[type] || 'mdi-information'
}
</script>

<style scoped>
.notification-snackbar {
  margin-top: 8px;
}
</style>