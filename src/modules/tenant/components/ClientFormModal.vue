<template>
  <v-dialog
    v-model="model"
    max-width="640"
    persistent
    @keydown.esc="close"
  >
    <v-card>
      <!-- HEADER -->
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-bold">
          {{ isEdit ? 'Editar cliente' : 'Nuevo cliente' }}
        </span>

        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- BODY -->
      <v-card-text class="pt-4">
        <v-form ref="formRef">
          <v-text-field
            label="Nombre completo"
            v-model="form.name"
            required
            density="comfortable"
          />

          <v-text-field
            label="Teléfono"
            v-model="form.phone"
            density="comfortable"
          />

          <v-text-field
            label="Correo electrónico"
            v-model="form.email"
            density="comfortable"
          />

          <v-text-field
            label="Dirección"
            v-model="form.dir"
            density="comfortable"
          />

          <v-text-field
            label="Ciudad"
            v-model="form.city"
            density="comfortable"
          />

          <v-textarea
            label="Notas / Observaciones"
            v-model="form.notes"
            rows="2"
          />

          <!-- FUTURO -->
          <v-card variant="tonal" color="info" class="mt-3 pa-3">
            <div class="d-flex justify-space-between align-center flex-wrap ga-2">
              <div>
                <div class="font-weight-medium">Documentos y consentimientos</div>
                <div class="text-caption">
                  Carga archivos del cliente y genera reportes internos (consentimiento informado, evolución, etc.)
                </div>
              </div>
              <v-btn
                v-if="isEdit"
                color="info"
                variant="outlined"
                prepend-icon="mdi-file-document-edit-outline"
                @click="openDocuments"
              >
                Gestionar documentos
              </v-btn>
            </div>
          </v-card>
        </v-form>
      </v-card-text>

      <!-- FOOTER -->
      <v-divider />

      <v-card-actions class="justify-end px-4 py-3">
        <v-btn variant="outlined" @click="close">
          Cancelar
        </v-btn>

        <v-btn color="primary" @click="save">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  client: Object,
})

const emit = defineEmits(['update:modelValue', 'save', 'manage-documents'])

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const isEdit = computed(() => !!props.client)

const formRef = ref(null)

const form = ref({
  name: '',
  phone: '',
  email: '',
  dir: '',
  city: '',
  notes: '',
})

watch(
  () => props.client,
  value => {
    if (value) {
      form.value = { ...value }
    } else {
      reset()
    }
  },
  { immediate: true }
)

function openDocuments() {
  if (!props.client?.id) return
  emit('manage-documents', props.client)
  close()
}

function save() {
  emit('save', form.value)
  close()
}

function close() {
  emit('update:modelValue', false)
}

function reset() {
  form.value = {
    name: '',
    phone: '',
    email: '',
    dir: '',
    city: '',
    notes: '',
  }
}
</script>