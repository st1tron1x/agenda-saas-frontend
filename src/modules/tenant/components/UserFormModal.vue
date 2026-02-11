<template>
  <v-dialog v-model="model" max-width="480">
    <v-card>
      <v-card-title>
        {{ user ? 'Editar usuario' : 'Nuevo usuario' }}
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field
            label="Nombre"
            v-model="form.name"
            required
          />

          <v-text-field
            label="Email"
            v-model="form.email"
            type="email"
            required
          />

          <v-select
            label="Rol"
            :items="roles"
            v-model="form.role"
            required
          />

          <v-switch
            label="Usuario activo"
            v-model="form.active"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="close">Cancelar</v-btn>
        <v-btn color="primary" @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  user: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const form = ref({
  name: '',
  email: '',
  role: 'STAFF',
  active: true,
})

const roles = ['ADMIN', 'STAFF', 'READ_ONLY']

watch(
  () => props.user,
  (val) => {
    if (val) form.value = { ...val }
  },
  { immediate: true }
)

function save() {
  emit('save', form.value)
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>
