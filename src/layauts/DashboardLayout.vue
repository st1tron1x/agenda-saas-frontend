<script setup>
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <div class="dashboard-layout">
    <!-- Sidebar irá aquí -->
    <main class="dashboard-content">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1;
  padding: 20px;
}
</style>