<template>
  <v-dialog
    :model-value="modelValue"
    max-width="620"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ user ? 'Editar usuario' : 'Nuevo usuario interno' }}</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="emit('update:modelValue', false)"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-4">
        <v-form
          ref="formRef"
          v-model="isValid"
        >
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.name"
                label="Nombre"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="form.role"
                :items="roleOptions"
                label="Rol"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="form.status"
                :items="statusOptions"
                label="Estado"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="form.tenantScope"
                :items="scopeOptions"
                label="Alcance en tenants"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('update:modelValue', false)">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!isValid"
          @click="submit"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { PLATFORM_ROLE_OPTIONS } from '@/modules/platform/composables/usePlatformUsers'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const formRef = ref(null)
const isValid = ref(false)

const roleOptions = PLATFORM_ROLE_OPTIONS
const statusOptions = [
  { title: 'Activo', value: 'active' },
  { title: 'Invitado', value: 'invited' },
  { title: 'Suspendido', value: 'suspended' },
]
const scopeOptions = [
  { title: 'Global', value: 'global' },
  { title: 'Multi-tenant', value: 'multi-tenant' },
  { title: 'Limitado', value: 'limited' },
]

const defaultForm = {
  name: '',
  email: '',
  role: null,
  status: 'invited',
  tenantScope: 'limited',
}

const form = reactive({ ...defaultForm })

const rules = {
  required: value => !!value || 'Campo obligatorio',
  email: value => /.@.\../.test(value) || 'Email inválido',
}

watch(
  () => props.modelValue,
  value => {
    if (!value) return

    Object.assign(form, props.user
      ? {
          name: props.user.name,
          email: props.user.email,
          role: props.user.role,
          status: props.user.status,
          tenantScope: props.user.tenantScope,
        }
      : { ...defaultForm })
  }
)

function submit() {
  emit('save', { ...form })
}
</script>