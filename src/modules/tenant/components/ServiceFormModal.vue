<template>
  <v-dialog v-model="model" max-width="520">
    <v-card>

      <!-- HEADER -->
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-bold">
          {{ isEdit ? 'Editar servicio' : 'Nuevo servicio' }}
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
            label="Nombre del servicio"
            v-model="form.name"
            required
          />

          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Duración (min)"
                type="number"
                v-model="form.duration"
                required
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                label="Precio"
                type="number"
                v-model="form.price"
                prefix="$"
                required
              />
            </v-col>
          </v-row>

          <v-color-picker
            v-model="form.color"
            hide-inputs
            show-swatches
            swatches-max-height="120"
          />

          <v-switch
            label="Servicio activo"
            v-model="form.active"
            inset
          />

        </v-form>
      </v-card-text>

      <!-- FOOTER -->
      <v-divider />

      <v-card-actions class="justify-space-between px-4 py-3">
        <v-spacer />

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
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  service: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const isEdit = computed(() => !!props.service)

const formRef = ref(null)

const form = ref({
  name: '',
  duration: 60,
  price: 0,
  color: '#6366f1',
  active: true,
})

watch(
  () => props.service,
  (value) => {
    if (value) {
      form.value = { ...value }
    }
  },
  { immediate: true }
)

async function save() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  emit('save', form.value)
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>
