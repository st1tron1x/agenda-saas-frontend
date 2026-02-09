<template>
  <v-container fluid class="pa-6">

    <!-- HEADER -->
    <v-card class="section-card pa-4 mb-4 d-flex justify-space-between align-center" >
      <div>
        <h2 class="text-h6 font-weight-bold">Clientes</h2>
        <span class="text-caption text-grey">
          Gestiona tus clientes y su historial
        </span>
      </div>

      <div class="d-flex gap-2">
        
        <v-btn
          icon
          variant="outlined"
          @click="viewMode = 'cards'"
          :color="viewMode === 'cards' ? 'primary' : undefined"
        >
          <v-icon>mdi-view-grid</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="outlined"
          @click="viewMode = 'table'"
          :color="viewMode === 'table' ? 'primary' : undefined"
        >
          <v-icon>mdi-view-list</v-icon>
        </v-btn>

        <v-btn color="primary" prepend-icon="mdi-account-plus" @click="openModal">
          Nuevo cliente
        </v-btn>
      </div>
    </v-card>

    <!-- CONTENT -->
    <v-row v-if="viewMode === 'cards'">
      <v-col
        v-for="client in clients"
        :key="client.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ClientCard :client="client" @click="openDetail(client)" />
      </v-col>
    </v-row>

    <ClientTable
      v-else
      :clients="clients"
      @edit="openEdit"
    />

    <ClientFormModal
      v-model="modalOpen"
      :client="selectedClient"
      @save="saveClient"
    />

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import ClientCard from '@/modules/tenant/components/ClientCard.vue'
import ClientTable from '@/modules/tenant/components/ClientTable.vue'
import ClientFormModal from '@/modules/tenant/components/ClientFormModal.vue'
import { useRouter } from 'vue-router'

const viewMode = ref('cards')
const modalOpen = ref(false)
const selectedClient = ref(null)
const router = useRouter()

/* MOCK DATA (luego Django) */
const clients = ref([
  {
    id: 1,
    name: 'Ana Gómez',
    phone: '3001234567',
    email: 'ana@email.com',
    lastVisit: '2026-02-02',
  },
  {
    id: 2,
    name: 'María Ruiz',
    phone: '3019876543',
    email: 'maria@email.com',
    lastVisit: '2026-01-28',
  },
])

function openModal() {
  selectedClient.value = null
  modalOpen.value = true
}

function openEdit(client) {
  selectedClient.value = client
  modalOpen.value = true
}

function openDetail(client) {
  router.push(`/app/clients/${client.id}`)
}

function saveClient(data) {
  console.log('Guardar cliente:', data)
}

function goToClient(id) {
  router.push(`/app/clients/${id}`)
}
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}
.gap-2 {
  gap: 8px;
}

.client-card {
  cursor: pointer;
}
</style>