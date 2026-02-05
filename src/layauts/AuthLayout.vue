<template>
  <v-app>
    <v-main class="auth-main pa-0">
      <v-container fluid class="pa-0 fill-height">
        <v-row no-gutters class="fill-height">

          <!-- Branding -->
          <v-col
            cols="12"
            md="6"
            class="branding d-none d-md-flex align-center justify-center"
            :style="{ background: tenant.gradient }"
          >
            <div class="text-center">
              <v-img
                :src="tenant.logo.src"
                :width="tenant.logo.width"
                :aspect-ratio="tenant.logo.aspectRatio"
                contain
                class="mb-6"
              />
              <h2 class="text-white font-weight-medium">
                {{ tenant.name }}
              </h2>
            </div>
          </v-col>

          <!-- Formulario -->
          <v-col
            cols="12"
            md="6"
            class="d-flex align-center justify-center"
          >
            <router-view />
          </v-col>

        </v-row>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { useTenant } from '../composables/useTenant'
import AppFooter from '../components/AppFooter.vue'

const { tenant } = useTenant()
</script>

<style scoped>
.auth-main {
  height: calc(100vh - 48px); /* footer fijo */
  overflow: hidden;
}

.branding {
  background: linear-gradient(135deg, #B48CF2, #E0C3FC);
}
</style>
