<!--AuthLayout.vue-->
<template>
  <v-container fluid class="auth-layout pa-0">
    <v-row no-gutters class="fill-height">

      <!-- Imagen / Branding -->
      <v-col
        cols="12"
        md="6"
        class="branding d-none d-md-flex align-center justify-center"
        :style="{background: tenant.gradient}"
      >
        <div class="text-center">
          <v-img
            :src="tenant.logo.src"
            :width="tenant.logo.width"
            :aspect-ratio="tenant.logo.aspectRatio"
            class="mb-6"
            contain
          />
          <h2 class="text-white font-weight-medium">
            {{tenant.name}}
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
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
}

.branding {
  background: linear-gradient(135deg, #B48CF2, #E0C3FC);
}
</style>

<script setup>
import { useTenant } from '../composables/useTenant'

const { tenant } = useTenant()
</script>
