<template>
  <v-dialog v-model="model" max-width="700">
    <v-card>
      <v-card-title>
        Permisos de {{ user?.name }}
      </v-card-title>

      <v-card-text>
        <v-expansion-panels multiple>
          <v-expansion-panel
            v-for="group in PERMISSIONS"
            :key="group.key"
          >
            <v-expansion-panel-title>
              {{ group.label }}
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-checkbox
                v-for="perm in group.children"
                :key="perm.key"
                v-model="localPermissions"
                :label="perm.label"
                :value="perm.key"
                density="compact"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancelar</v-btn>
        <v-btn color="primary" @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { PERMISSIONS } from '@/constants/permissions'

const props = defineProps({
  modelValue: Boolean,
  user: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const localPermissions = ref([])

/* Cuando cambia el usuario, cargamos permisos */
watch(
  () => props.user,
  (u) => {
    localPermissions.value = u?.permissions
      ? [...u.permissions]
      : []
  },
  { immediate: true }
)

function close() {
  model.value = false
}

function save() {
  emit('save', {
    userId: props.user.id,
    permissions: localPermissions.value,
  })
  close()
}
</script>
