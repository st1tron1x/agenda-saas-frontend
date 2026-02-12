<template>
  <v-container 
    fluid 
    class="pa-6"
  >
    <!-- HEADER -->
    <v-card class="section-card pa-4 mb-4">
      <div class="d-flex justify-space-between align-center flex-wrap ga-3 mb-4">
        <div>
          <h2 class="text-h6 font-weight-bold">Clientes</h2>
          <span class="text-caption text-grey">
            Gestiona tus clientes y su historial
          </span>
        </div>

        <div class="d-flex ga-2 flex-wrap justify-end">
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
      </div>
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="filters.search"
            label="Buscar por nombre, teléfono o email"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="filters.city"
            :items="cityOptions"
            label="Ciudad"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="filters.tag"
            :items="tagOptions"
            label="Etiqueta"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" md="1">
          <v-btn block variant="outlined" @click="clearFilters">Limpiar</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- CONTENT -->
    <v-row v-if="viewMode === 'cards'">
      <v-col
        v-for="client in filteredClients"
        :key="client.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ClientCard :client="client" @select="openDetail(client)" />
      </v-col>
    </v-row>

    <ClientTable
      v-else
      :clients="filteredClients"
      @edit="openEdit"
      @viwe="openDetail"
    />

    <ClientFormModal
      v-model="modalOpen"
      :client="selectedClient"
      @save="saveClient"
      @manage-documents="openDocuments"
    />
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import ClientCard from '@/modules/tenant/components/ClientCard.vue'
import ClientTable from '@/modules/tenant/components/ClientTable.vue'
import ClientFormModal from '@/modules/tenant/components/ClientFormModal.vue'
import { useRouter } from 'vue-router'

const viewMode = ref('cards')
const modalOpen = ref(false)
const selectedClient = ref(null)
const router = useRouter()

const filters = ref({
  search: '',
  city: null,
  tag: null,
})

/* MOCK DATA (luego Django) */
const clients = ref([
  {
    id: 1,
    name: 'Ana Gómez',
    phone: '3001234567',
    email: 'ana@email.com',
    city: 'Bogota',
    tags: ['Frecuente', 'Premium'],
    lastVisit: '2026-02-02',
  },
  {
    id: 2,
    name: 'María Ruiz',
    phone: '3019876543',
    email: 'maria@email.com',
    city: 'Medellín',
    tags: ['Nuevo'],
    lastVisit: '2026-01-28',
  },
  {
    id: 3,
    name: 'Camila Pérez',
    phone: '3150001234',
    email: 'camila@email.com',
    city: 'Bogotá',
    tags: ['Frecuente'],
    lastVisit: '2026-02-10',
  },
])

const cityOptions = computed(() => {
  const cities = [...new Set(clients.value.map(client => client.city).filter(Boolean))]
  return cities
})

const tagOptions = computed(() => {
  const tags = new Set()
  clients.value.forEach(client => {
    (client.tags || []).forEach(tag => tags.add(tag))
  })
  return [...tags]
})

const filteredClients = computed(() => {
  return clients.value.filter(client => {
    const query = filters.value.search.toLowerCase()
    const bySearch = !query
      || client.name.toLowerCase().includes(query)
      || client.phone.toLowerCase().includes(query)
      || client.email.toLowerCase().includes(query)

    const byCity = !filters.value.city || client.city === filters.value.city
    const byTag = !filters.value.tag || (client.tags || []).includes(filters.value.tag)

    return bySearch && byCity && byTag
  })
})

function clearFilters() {
  filters.value = {
    search: '',
    city: null,
    tag: null,
  }
}

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

function openDocuments(client) {
  router.push(`/app/clients/${client.id}/documents`)
}

function saveClient(data) {
  if (selectedClient.value){
    const index = clients.value.findIndex(client => client.id === selectedClient.value.id)
    if (index !== -1){
      clients.value[index] = {
        ...clients.value[index],
        ...data,
      }
    }
    return
  }
  clients.value.unshift({
    ...data,
    id: Date.now(),
    lastVisit: null,
    tags: data.tags || [],
  })
}
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}

</style>