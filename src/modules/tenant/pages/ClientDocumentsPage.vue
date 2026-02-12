<template>
  <v-container fluid class="pa-6">
    <v-card class="pa-4 mb-4 d-flex justify-space-between align-center flex-wrap ga-2">
      <div>
        <h2 class="text-h6 font-weight-bold">Documentos del cliente</h2>
        <div class="text-caption text-grey">
          Consentimiento informado, reportes y documentos cargados.
        </div>
      </div>
      <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="goBack">
        Volver al cliente
      </v-btn>
    </v-card>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="pa-4 mb-4">
          <h3 class="text-subtitle-1 font-weight-medium mb-3">Documentos cargados</h3>

          <v-file-input
            v-model="uploadedFile"
            label="Subir documento"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            @update:model-value="handleUpload"
          />

          <v-list v-if="documents.length" lines="two" class="mt-2">
            <v-list-item
              v-for="doc in documents"
              :key="doc.id"
              :title="doc.name"
              :subtitle="`${doc.type} · ${doc.createdAt}`"
            >
              <template #append>
                <v-btn icon="mdi-eye" variant="text" size="small" />
                <v-btn icon="mdi-download" variant="text" size="small" />
              </template>
            </v-list-item>
          </v-list>

          <v-alert v-else type="info" variant="tonal" class="mt-2">
            Aún no hay documentos cargados para este cliente.
          </v-alert>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-4 mb-4">
          <h3 class="text-subtitle-1 font-weight-medium mb-3">Generador interno de documentos</h3>

          <v-select
            v-model="reportForm.template"
            :items="templateOptions"
            label="Plantilla"
            variant="outlined"
          />

          <v-text-field
            v-model="reportForm.title"
            label="Título del documento"
            variant="outlined"
          />

          <v-textarea
            v-model="reportForm.notes"
            label="Contenido / observaciones"
            rows="4"
            variant="outlined"
          />

          <v-btn color="primary" block prepend-icon="mdi-file-document-plus" @click="createReport">
            Crear reporte
          </v-btn>

          <v-alert type="success" variant="tonal" class="mt-3" v-if="createdMessage">
            {{ createdMessage }}
          </v-alert>
        </v-card>

        <v-card class="pa-4">
          <h3 class="text-subtitle-1 font-weight-medium mb-2">Acceso soporte / super admin</h3>
          <p class="text-caption text-grey mb-0">
            Estos reportes pueden ser visibles para soporte interno y super admin desde el módulo de soporte,
            según permisos del backend.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const uploadedFile = ref(null)
const createdMessage = ref('')

const documents = ref([
  {
    id: 1,
    name: 'Consentimiento informado inicial.pdf',
    type: 'Consentimiento',
    createdAt: '2026-02-10',
  },
])

const reportForm = ref({
  template: 'consentimiento',
  title: '',
  notes: '',
})

const templateOptions = [
  { title: 'Consentimiento informado', value: 'consentimiento' },
  { title: 'Reporte de evolución', value: 'evolucion' },
  { title: 'Reporte personalizado', value: 'personalizado' },
]

function handleUpload(file) {
  if (!file) return

  documents.value.unshift({
    id: Date.now(),
    name: file.name,
    type: 'Archivo cargado',
    createdAt: new Date().toISOString().split('T')[0],
  })

  uploadedFile.value = null
}

function createReport() {
  const title = reportForm.value.title || 'Documento sin título'
  const type = templateOptions.find(item => item.value === reportForm.value.template)?.title || 'Reporte'

  documents.value.unshift({
    id: Date.now(),
    name: `${title}.pdf`,
    type,
    createdAt: new Date().toISOString().split('T')[0],
  })

  createdMessage.value = `Se generó "${title}" para el cliente ${route.params.id}.`
  reportForm.value.title = ''
  reportForm.value.notes = ''
}

function goBack() {
  router.push(`/app/clients/${route.params.id}`)
}
</script>