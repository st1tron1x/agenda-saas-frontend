<template>
  <v-dialog v-model="model" max-width="700">
    <v-card>

      <v-card-title>
        Permisos de {{ user?.name }}
      </v-card-title>

      <v-card-text>

        <v-expansion-panels multiple>
          <v-expansion-panel
            v-for="group in permissions"
            :key="group.key"
          >
            <v-expansion-panel-title>
              <v-checkbox
                :label="group.label"
                :model-value="isGroupChecked(group)"
                @update:modelValue="toggleGroup(group)"
              />
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-checkbox
                v-for="perm in group.children"
                :key="perm.key"
                :label="perm.label"
                :value="perm.key"
                v-model="selectedPermissions"
              />
            </v-expansion-panel-text>

          </v-expansion-panel>
        </v-expansion-panels>

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
import { ref, computed, watch } from 'vue'
import { PERMISSIONS } from '@/constants/permissions'


const props = defineProps({
  modelValue: Boolean,
  user: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const permissions = PERMISSIONS

const selectedPermissions = ref([])

watch(
  () => props.user,
  (u) => {
    if (u?.permissions) {
      selectedPermissions.value = [...u.permissions]
    }
  },
  { immediate: true }
)

function isGroupChecked(group) {
  return group.children.every(p =>
    selectedPermissions.value.includes(p.key)
  )
}

function toggleGroup(group) {
  const keys = group.children.map(p => p.key)
  const enabled = isGroupChecked(group)

  if (enabled) {
    selectedPermissions.value = selectedPermissions.value.filter(
      p => !keys.includes(p)
    )
  } else {
    selectedPermissions.value = [
      ...new Set([...selectedPermissions.value, ...keys]),
    ]
  }
}

function save() {
  emit('save', selectedPermissions.value)
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>