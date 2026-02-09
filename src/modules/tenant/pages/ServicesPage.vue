<template>
  <v-container fluid class="pa-6">

    <v-card class="pa-4 mb-4 d-flex justify-space-between align-center">
      <div>
        <h2 class="text-h6 font-weight-bold">Servicios</h2>
        <span class="text-caption text-grey">
          Configura los servicios que ofrece tu negocio
        </span>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openModal"
      >
        Nuevo servicio
      </v-btn>
    </v-card>

    <!-- LISTA -->
    <v-row>
      <v-col
        v-for="service in services"
        :key="service.id"
        cols="12"
        sm="6"
        md="4"
      >
        <ServiceCard
          :service="service"
          @edit="editService"
        />
      </v-col>
    </v-row>

    <ServiceFormModal
      v-model="modalOpen"
      :service="selectedService"
      @save="saveService"
    />

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import ServiceCard from '@/modules/tenant/components/ServiceCard.vue'
import ServiceFormModal from '@/modules/tenant/components/ServiceFormModal.vue'

const modalOpen = ref(false)
const selectedService = ref(null)

/* MOCK */
const services = ref([
  {
    id: 1,
    name: 'Micropigmentación labios',
    duration: 120,
    price: 450000,
    color: '#ec4899',
    active: true,
  },
  {
    id: 2,
    name: 'Diseño de cejas',
    duration: 60,
    price: 120000,
    color: '#6366f1',
    active: true,
  },
])

function openModal() {
  selectedService.value = null
  modalOpen.value = true
}

function editService(service) {
  selectedService.value = service
  modalOpen.value = true
}

function saveService(data) {
  console.log('Guardar servicio', data)
}
</script>
