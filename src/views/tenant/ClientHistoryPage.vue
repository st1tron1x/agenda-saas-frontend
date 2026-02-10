<!-- src/views/tenant/ClientHistoryPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
          class="mb-2"
        >
          Volver a Clientes
        </v-btn>
        <h1 class="text-h4 font-weight-bold mb-2">
          Historial de {{ client?.name }}
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          {{ client?.email }} • {{ client?.phone }}
        </p>
      </div>
      <div class="d-flex gap-3">
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-file-upload"
          @click="openUploadDialog"
        >
          Subir Documento
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openAddNoteDialog"
        >
          Nueva Nota
        </v-btn>
      </div>
    </div>

    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Total Visitas</p>
                <h2 class="text-h4 font-weight-bold">{{ summary.total_visits }}</h2>
              </div>
              <v-avatar color="primary" size="48">
                <v-icon>mdi-calendar-check</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Procedimientos</p>
                <h2 class="text-h4 font-weight-bold">{{ summary.total_procedures }}</h2>
              </div>
              <v-avatar color="success" size="48">
                <v-icon>mdi-medical-bag</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Documentos</p>
                <h2 class="text-h4 font-weight-bold">{{ summary.total_documents }}</h2>
              </div>
              <v-avatar color="info" size="48">
                <v-icon>mdi-file-document</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Última Visita</p>
                <p class="text-body-1 font-weight-medium">
                  {{ summary.last_visit ? formatDate(summary.last_visit) : 'N/A' }}
                </p>
              </div>
              <v-avatar color="warning" size="48">
                <v-icon>mdi-clock-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Timeline (Left Column) -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span>Historial Clínico</span>
            <v-btn-toggle
              v-model="timelineFilter"
              density="compact"
              variant="outlined"
              mandatory
            >
              <v-btn value="all" size="small">Todos</v-btn>
              <v-btn value="visits" size="small">Visitas</v-btn>
              <v-btn value="notes" size="small">Notas</v-btn>
              <v-btn value="documents" size="small">Documentos</v-btn>
            </v-btn-toggle>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-0">
            <v-timeline
              side="end"
              density="compact"
              class="pa-6"
            >
              <v-timeline-item
                v-for="item in filteredTimeline"
                :key="item.id"
                :dot-color="getTimelineColor(item.type)"
                size="small"
              >
                <template #icon>
                  <v-icon size="small">{{ getTimelineIcon(item.type) }}</v-icon>
                </template>

                <v-card :variant="item.type === 'visit' ? 'tonal' : 'outlined'">
                  <v-card-title class="text-subtitle-1 d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-chip
                        :color="getTimelineColor(item.type)"
                        size="small"
                        class="mr-3"
                      >
                        {{ getTypeLabel(item.type) }}
                      </v-chip>
                      <span>{{ item.title }}</span>
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ formatDateTime(item.created_at) }}
                    </div>
                  </v-card-title>

                  <v-card-text>
                    <!-- Visit Details -->
                    <div v-if="item.type === 'visit'">
                      <div class="mb-3">
                        <v-chip
                          size="small"
                          prepend-icon="mdi-account"
                          class="mr-2"
                        >
                          {{ item.staff_name }}
                        </v-chip>
                        <v-chip
                          size="small"
                          prepend-icon="mdi-clipboard-list"
                        >
                          {{ item.service_name }}
                        </v-chip>
                      </div>
                      
                      <div v-if="item.notes" class="mb-3">
                        <p class="text-caption text-medium-emphasis mb-1">Notas del procedimiento:</p>
                        <p class="text-body-2">{{ item.notes }}</p>
                      </div>

                      <div v-if="item.photos && item.photos.length">
                        <p class="text-caption text-medium-emphasis mb-2">Fotos del procedimiento:</p>
                        <div class="d-flex gap-2">
                          <v-img
                            v-for="photo in item.photos"
                            :key="photo.id"
                            :src="photo.url"
                            width="80"
                            height="80"
                            cover
                            class="rounded cursor-pointer"
                            @click="viewPhoto(photo)"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Note Details -->
                    <div v-if="item.type === 'note'">
                      <p class="text-body-2 mb-2">{{ item.content }}</p>
                      <div class="text-caption text-medium-emphasis">
                        Por: {{ item.created_by_name }}
                      </div>
                    </div>

                    <!-- Document Details -->
                    <div v-if="item.type === 'document'">
                      <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                          <v-icon :color="getFileColor(item.file_type)" class="mr-2">
                            {{ getFileIcon(item.file_type) }}
                          </v-icon>
                          <div>
                            <p class="text-body-2 font-weight-medium">{{ item.file_name }}</p>
                            <p class="text-caption text-medium-emphasis">
                              {{ item.file_size }} • Subido por {{ item.uploaded_by_name }}
                            </p>
                          </div>
                        </div>
                        <div>
                          <v-tooltip text="Descargar">
                            <template #activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon="mdi-download"
                                size="small"
                                variant="text"
                                @click="downloadDocument(item)"
                              />
                            </template>
                          </v-tooltip>
                          <v-tooltip text="Eliminar">
                            <template #activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon="mdi-delete"
                                size="small"
                                variant="text"
                                color="error"
                                @click="deleteDocument(item)"
                              />
                            </template>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>

            <div v-if="!filteredTimeline.length" class="text-center pa-8">
              <v-icon size="64" color="grey">mdi-history</v-icon>
              <p class="text-h6 text-medium-emphasis mt-4">No hay registros</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Documents Panel (Right Column) -->
      <v-col cols="12" md="4">
        <!-- Quick Info -->
        <v-card class="mb-4">
          <v-card-title>Información Rápida</v-card-title>
          <v-divider />
          <v-card-text>
            <div class="mb-3">
              <p class="text-caption text-medium-emphasis mb-1">Fecha de Nacimiento</p>
              <p class="text-body-1">{{ client?.birthdate || 'No especificado' }}</p>
            </div>
            <div class="mb-3">
              <p class="text-caption text-medium-emphasis mb-1">Alergias</p>
              <p class="text-body-1">{{ client?.allergies || 'Ninguna registrada' }}</p>
            </div>
            <div class="mb-3">
              <p class="text-caption text-medium-emphasis mb-1">Condiciones Médicas</p>
              <p class="text-body-1">{{ client?.medical_conditions || 'Ninguna registrada' }}</p>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Cliente desde</p>
              <p class="text-body-1">{{ formatDate(client?.created_at) }}</p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Documents List -->
        <v-card>
          <v-card-title>Documentos</v-card-title>
          <v-divider />
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item
                v-for="doc in documents"
                :key="doc.id"
                @click="downloadDocument(doc)"
              >
                <template #prepend>
                  <v-icon :color="getFileColor(doc.file_type)">
                    {{ getFileIcon(doc.file_type) }}
                  </v-icon>
                </template>

                <v-list-item-title>{{ doc.file_name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ doc.file_size }} • {{ formatDate(doc.created_at) }}
                </v-list-item-subtitle>

                <template #append>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click.stop="deleteDocument(doc)"
                  />
                </template>
              </v-list-item>
            </v-list>

            <div v-if="!documents.length" class="text-center pa-6">
              <v-icon size="48" color="grey">mdi-file-document-outline</v-icon>
              <p class="text-caption text-medium-emphasis mt-2">No hay documentos</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Note Dialog -->
    <v-dialog v-model="noteDialog.show" max-width="600" persistent>
      <v-card>
        <v-card-title>Nueva Nota</v-card-title>
        <v-divider />
        <v-card-text class="pt-6">
          <v-form ref="noteFormRef" v-model="noteFormValid">
            <v-text-field
              v-model="noteForm.title"
              label="Título *"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-text"
            />
            <v-textarea
              v-model="noteForm.content"
              label="Contenido *"
              :rules="[rules.required]"
              variant="outlined"
              rows="5"
              prepend-inner-icon="mdi-note-text"
            />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn @click="noteDialog.show = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="!noteFormValid"
            @click="saveNote"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Upload Document Dialog -->
    <v-dialog v-model="uploadDialog.show" max-width="600" persistent>
      <v-card>
        <v-card-title>Subir Documento</v-card-title>
        <v-divider />
        <v-card-text class="pt-6">
          <v-form ref="uploadFormRef" v-model="uploadFormValid">
            <v-select
              v-model="uploadForm.document_type"
              :items="documentTypes"
              label="Tipo de Documento *"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-file-document"
            />

            <v-text-field
              v-model="uploadForm.description"
              label="Descripción"
              variant="outlined"
              prepend-inner-icon="mdi-text"
            />

            <v-file-input
              v-model="uploadForm.file"
              label="Archivo *"
              :rules="[rules.required, rules.fileSize]"
              variant="outlined"
              prepend-icon=""
              prepend-inner-icon="mdi-paperclip"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              show-size
            >
              <template #selection="{ fileNames }">
                <v-chip
                  v-for="fileName in fileNames"
                  :key="fileName"
                  size="small"
                  color="primary"
                >
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>

            <v-alert type="info" variant="tonal" density="compact">
              Formatos permitidos: PDF, JPG, PNG, DOC, DOCX. Tamaño máximo: 10MB
            </v-alert>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn @click="uploadDialog.show = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="uploading"
            :disabled="!uploadFormValid"
            @click="uploadDocument"
          >
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Photo Viewer Dialog -->
    <v-dialog v-model="photoDialog.show" max-width="900">
      <v-card v-if="photoDialog.photo">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Foto del Procedimiento</span>
          <v-btn icon="mdi-close" variant="text" @click="photoDialog.show = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-img
            :src="photoDialog.photo.url"
            max-height="600"
            contain
          />
          <p v-if="photoDialog.photo.notes" class="mt-4">
            {{ photoDialog.photo.notes }}
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const { notify } = useNotification()

// State
const client = ref(null)
const timeline = ref([])
const documents = ref([])
const timelineFilter = ref('all')
const saving = ref(false)
const uploading = ref(false)
const noteFormValid = ref(false)
const uploadFormValid = ref(false)
const noteFormRef = ref(null)
const uploadFormRef = ref(null)

const summary = ref({
  total_visits: 0,
  total_procedures: 0,
  total_documents: 0,
  last_visit: null,
})

const noteDialog = ref({
  show: false,
})

const uploadDialog = ref({
  show: false,
})

const photoDialog = ref({
  show: false,
  photo: null,
})

const noteForm = ref({
  title: '',
  content: '',
})

const uploadForm = ref({
  document_type: '',
  description: '',
  file: null,
})

const documentTypes = [
  { title: 'Consentimiento Informado', value: 'informed_consent' },
  { title: 'Historia Clínica', value: 'medical_history' },
  { title: 'Exámenes Médicos', value: 'medical_exams' },
  { title: 'Receta Médica', value: 'prescription' },
  { title: 'Otro', value: 'other' },
]

// Validation rules
const rules = {
  required: v => !!v || 'Campo requerido',
  fileSize: v => {
    if (!v || !v.length) return true
    return v[0].size < 10 * 1024 * 1024 || 'El archivo debe ser menor a 10MB'
  },
}

// Computed
const filteredTimeline = computed(() => {
  if (timelineFilter.value === 'all') return timeline.value
  return timeline.value.filter(item => item.type === timelineFilter.value.slice(0, -1))
})

// Methods
async function loadClient() {
  try {
    const clientId = route.params.id
    // TODO: Replace with API call
    // const response = await api.get(`/tenant/clients/${clientId}`)
    // client.value = response.data
    
    // Mock data
    client.value = {
      id: clientId,
      name: 'María Fernanda López',
      email: 'maria@example.com',
      phone: '+57 300 123 4567',
      birthdate: '1990-05-15',
      allergies: 'Ninguna',
      medical_conditions: 'Ninguna',
      created_at: '2023-06-15T10:00:00Z',
    }
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al cargar cliente',
    })
  }
}

async function loadHistory() {
  try {
    const clientId = route.params.id
    // TODO: Replace with API call
    // const response = await api.get(`/tenant/clients/${clientId}/history`)
    // timeline.value = response.data
    
    // Mock data
    timeline.value = [
      {
        id: 1,
        type: 'visit',
        title: 'Micropigmentación de Cejas',
        service_name: 'Micropigmentación de Cejas',
        staff_name: 'Ana García',
        notes: 'Primera sesión de micropigmentación. Cliente satisfecha con el diseño. Se aplicó técnica de pelo a pelo en tono marrón medio.',
        photos: [
          { id: 1, url: 'https://via.placeholder.com/400', notes: 'Antes del procedimiento' },
          { id: 2, url: 'https://via.placeholder.com/400', notes: 'Después del procedimiento' },
        ],
        created_at: '2024-02-05T14:30:00Z',
      },
      {
        id: 2,
        type: 'document',
        title: 'Consentimiento Informado',
        file_name: 'consentimiento-micropigmentacion.pdf',
        file_type: 'pdf',
        file_size: '245 KB',
        uploaded_by_name: 'Ana García',
        created_at: '2024-02-05T14:00:00Z',
      },
      {
        id: 3,
        type: 'note',
        title: 'Primera Consulta',
        content: 'Cliente interesada en micropigmentación de cejas. Se explicaron los procedimientos, cuidados post-tratamiento y se realizó prueba de alergia.',
        created_by_name: 'Ana García',
        created_at: '2024-01-28T10:15:00Z',
      },
    ]

    documents.value = timeline.value.filter(item => item.type === 'document')
    
    calculateSummary()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al cargar historial',
    })
  }
}

function calculateSummary() {
  summary.value = {
    total_visits: timeline.value.filter(item => item.type === 'visit').length,
    total_procedures: timeline.value.filter(item => item.type === 'visit').length,
    total_documents: timeline.value.filter(item => item.type === 'document').length,
    last_visit: timeline.value.find(item => item.type === 'visit')?.created_at || null,
  }
}

function openAddNoteDialog() {
  noteDialog.value.show = true
  noteForm.value = { title: '', content: '' }
}

function openUploadDialog() {
  uploadDialog.value.show = true
  uploadForm.value = { document_type: '', description: '', file: null }
}

async function saveNote() {
  const { valid } = await noteFormRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    // TODO: Replace with API call
    // await api.post(`/tenant/clients/${client.value.id}/notes`, noteForm.value)
    
    notify({
      type: 'success',
      message: 'Nota guardada exitosamente',
    })
    noteDialog.value.show = false
    await loadHistory()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al guardar nota',
    })
  } finally {
    saving.value = false
  }
}

async function uploadDocument() {
  const { valid } = await uploadFormRef.value.validate()
  if (!valid) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadForm.value.file[0])
    formData.append('document_type', uploadForm.value.document_type)
    formData.append('description', uploadForm.value.description)

    // TODO: Replace with API call
    // await api.post(`/tenant/clients/${client.value.id}/documents`, formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // })
    
    notify({
      type: 'success',
      message: 'Documento subido exitosamente',
    })
    uploadDialog.value.show = false
    await loadHistory()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al subir documento',
    })
  } finally {
    uploading.value = false
  }
}

async function downloadDocument(doc) {
  try {
    // TODO: Replace with API call to download
    // window.open(doc.download_url, '_blank')
    notify({
      type: 'info',
      message: 'Descargando documento...',
    })
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al descargar documento',
    })
  }
}

async function deleteDocument(doc) {
  if (!confirm('¿Seguro que deseas eliminar este documento?')) return

  try {
    // TODO: Replace with API call
    // await api.delete(`/tenant/documents/${doc.id}`)
    
    notify({
      type: 'success',
      message: 'Documento eliminado',
    })
    await loadHistory()
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al eliminar documento',
    })
  }
}

function viewPhoto(photo) {
  photoDialog.value = {
    show: true,
    photo: photo,
  }
}

function goBack() {
  router.push({ name: 'clients' })
}

function getTimelineColor(type) {
  const colors = {
    visit: 'primary',
    note: 'info',
    document: 'success',
  }
  return colors[type] || 'grey'
}

function getTimelineIcon(type) {
  const icons = {
    visit: 'mdi-medical-bag',
    note: 'mdi-note-text',
    document: 'mdi-file-document',
  }
  return icons[type] || 'mdi-circle'
}

function getTypeLabel(type) {
  const labels = {
    visit: 'Visita',
    note: 'Nota',
    document: 'Documento',
  }
  return labels[type] || type
}

function getFileIcon(fileType) {
  const icons = {
    pdf: 'mdi-file-pdf-box',
    doc: 'mdi-file-word-box',
    docx: 'mdi-file-word-box',
    jpg: 'mdi-file-image',
    jpeg: 'mdi-file-image',
    png: 'mdi-file-image',
  }
  return icons[fileType] || 'mdi-file'
}

function getFileColor(fileType) {
  const colors = {
    pdf: 'error',
    doc: 'primary',
    docx: 'primary',
    jpg: 'success',
    jpeg: 'success',
    png: 'success',
  }
  return colors[fileType] || 'grey'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateTime(datetime) {
  return new Date(datetime).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Lifecycle
onMounted(() => {
  loadClient()
  loadHistory()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>