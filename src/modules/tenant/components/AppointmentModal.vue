<template>
  <v-dialog v-model="model" max-width="520" >
    <v-card>

      <!-- HEADER -->
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-bold">
          {{ isEdit ? 'Editar cita' : 'Nueva cita' }}
        </span>

        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- BODY -->
      <v-card-text class="pt-4">
        <v-form ref="formRef">

          <v-select
            label="Cliente"
            :items="clients"
            item-title="name"
            item-value="id"
            v-model="form.clientId"
            density="comfortable"
            required
          />
          <v-btn
            size="small"
            variant="text"
            prepend-icon="mdi-account-plus"
          >
            Nuevo cliente
          </v-btn>

          <v-btn
            variant="text"
            prepend-icon="mdi-account"
            @click="goToClient"
          >
            Ver cliente
          </v-btn>

          <v-select
            label="Servicio"
            :items="services"
            item-title="name"
            item-value="id"
            v-model="form.serviceId"
            density="comfortable"
            required
          />

          <v-select
            label="Estado"
            :items="statuses"
            v-model="form.status"
            density="comfortable"
          />

          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Fecha"
                type="date"
                v-model="form.date"
                required
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                label="Hora"
                type="time"
                v-model="form.time"
                required
              />
            </v-col>
          </v-row>

          <v-textarea
            label="Notas"
            v-model="form.notes"
            rows="2"
          />

        </v-form>
      </v-card-text>

      <v-divider class="my-4" />

      <v-file-input
        label="Fotos antes"
        multiple
        prepend-icon="mdi-camera"
        accept="image/*"
      />

      <v-file-input
        label="Fotos después"
        multiple
        prepend-icon="mdi-camera-check"
        accept="image/*"
      />

      <!-- FOOTER -->
      <v-divider />

      <v-card-actions class="justify-space-between px-4 py-3">
        <v-btn
          v-if="isEdit"
          color="error"
          variant="text"
          @click="cancelAppointment"
        >
          Cancelar cita
        </v-btn>

        <v-spacer />

        <v-btn variant="outlined" @click="close">
          Cerrar
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
import { useRouter } from 'vue-router'

const router = useRouter()

function goToClient() {
  if (!props.appointment?.clientId) return
  router.push(`/app/clients/${props.appointment.clientId}`)
}

const props = defineProps({
  modelValue: Boolean,
  appointment: Object,
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isEdit = computed(() => !!props.appointment)

const formRef = ref(null)

const form = ref({
  clientId: null,
  serviceId: null,
  status: 'CONFIRMADA',
  date: '',
  time: '',
  duration: null,
  notes: '',
})
watch(
  () => form.value.serviceId,
  (serviceId) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      form.value.duration = service.duration || 60
    }
  }
)

/* MOCK DATA (luego backend Django) */
const clients = [
  { id: 1, name: 'Ana Gómez' },
  { id: 2, name: 'María Ruiz' },
]

const services = [
  { id: 1, name: 'Micropigmentación labios' },
  { id: 2, name: 'Diseño de cejas' },
]

const statuses = [
  'CONFIRMADA',
  'PENDIENTE',
  'CANCELADA',
]

watch(
  () => props.appointment,
  (value) => {
    if (value) form.value = { ...value }
  },
  { immediate: true }
)

async function save() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  emit('save', form.value)
  close()
}

function cancelAppointment() {
  emit('cancel', props.appointment)
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>