<template>
  <div class="d-flex gap-2">
    <v-btn
      color="primary"
      size="small"
      prepend-icon="mdi-plus"
      @click="showAppointment = true"
    >
      Nueva cita
    </v-btn>

    <v-btn
      variant="outlined"
      size="small"
      prepend-icon="mdi-account-plus"
      @click="showClient = true"
    >
      Nuevo cliente
    </v-btn>

    <AppointmentCreateModal v-model="showAppointment" />
    <ClientCreateModal v-model="showClient" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppointmentCreateModal from './modals/AppointmentCreateModal.vue'
import ClientCreateModal from './modals/ClientCreateModal.vue'

const showAppointment = ref(false)
const showClient = ref(false)
</script>