<!-- src/views/tenant/PermissionsManagementPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Gestión de Permisos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Configure permisos granulares para {{ editingUser?.name || 'nuevo usuario' }}
        </p>
      </div>
      <div class="d-flex gap-3">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
        >
          Volver
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-content-save"
          :loading="saving"
          @click="savePermissions"
        >
          Guardar Cambios
        </v-btn>
      </div>
    </div>

    <!-- Permission Stats Card -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="64" class="mr-4">
                <v-icon size="32">mdi-shield-check</v-icon>
              </v-avatar>
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Permisos Activos</p>
                <h2 class="text-h4 font-weight-bold">
                  {{ permissionStats.active }} / {{ permissionStats.total }}
                </h2>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Cobertura</span>
                <span class="text-caption font-weight-bold">{{ permissionStats.percentage }}%</span>
              </div>
              <v-progress-linear
                :model-value="permissionStats.percentage"
                :color="permissionStats.percentage === 100 ? 'success' : 'primary'"
                height="8"
                rounded
              />
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-chip
              :color="detectedPreset === 'custom' ? 'purple' : ROLE_PRESETS[detectedPreset]?.color || 'grey'"
              size="large"
              prepend-icon="mdi-shield-account"
            >
              Perfil: {{ ROLE_PRESETS[detectedPreset]?.label || 'Personalizado' }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Role Presets -->
    <v-card class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-account-multiple</v-icon>
        Plantillas de Roles
      </v-card-title>
      <v-divider />
      <v-card-text>
        <p class="text-caption text-medium-emphasis mb-4">
          Selecciona un rol predefinido o personaliza los permisos manualmente
        </p>
        <v-row>
          <v-col
            v-for="(preset, key) in ROLE_PRESETS"
            :key="key"
            cols="6"
            sm="4"
            md="2"
          >
            <v-card
              :variant="selectedPreset === key ? 'tonal' : 'outlined'"
              :color="selectedPreset === key ? preset.color : ''"
              class="text-center cursor-pointer"
              @click="applyPreset(key)"
              hover
            >
              <v-card-text class="pa-4">
                <v-avatar
                  :color="preset.color"
                  size="48"
                  class="mb-3"
                >
                  <v-icon>mdi-shield-account</v-icon>
                </v-avatar>
                <div class="text-subtitle-2 font-weight-bold mb-1">
                  {{ preset.label }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ preset.description }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Permissions Tree -->
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-file-tree</v-icon>
          Permisos Detallados
        </div>
        <div>
          <v-btn
            size="small"
            variant="text"
            prepend-icon="mdi-checkbox-marked"
            @click="selectAll"
          >
            Seleccionar Todo
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            prepend-icon="mdi-checkbox-blank-outline"
            @click="deselectAll"
          >
            Deseleccionar Todo
          </v-btn>
        </div>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-0">
        <!-- Search Filter -->
        <div class="pa-4 pb-0">
          <v-text-field
            v-model="searchQuery"
            label="Buscar permisos..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </div>

        <!-- Permissions List -->
        <v-expansion-panels
          v-model="expandedPanels"
          multiple
          class="permission-panels"
        >
          <v-expansion-panel
            v-for="(module, moduleId) in filteredModules"
            :key="moduleId"
            :value="moduleId"
          >
            <!-- Module Header -->
            <v-expansion-panel-title>
              <template #default="{ expanded }">
                <div class="d-flex align-center justify-space-between w-100 pr-4">
                  <div class="d-flex align-center">
                    <v-checkbox
                      :model-value="isModuleFullySelected(moduleId)"
                      :indeterminate="isModulePartiallySelected(moduleId)"
                      hide-details
                      density="compact"
                      @click.stop="toggleEntireModule(moduleId)"
                    />
                    <v-avatar
                      :color="module.color"
                      size="32"
                      class="mx-3"
                    >
                      <v-icon size="18" color="white">{{ module.icon }}</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">
                        {{ module.label }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ module.description }}
                      </div>
                    </div>
                  </div>
                  <v-chip
                    size="small"
                    :color="getModuleActiveCount(moduleId) > 0 ? 'success' : 'grey'"
                  >
                    {{ getModuleActiveCount(moduleId) }} / {{ getModuleTotalCount(moduleId) }}
                  </v-chip>
                </div>
              </template>
            </v-expansion-panel-title>

            <!-- Module Content -->
            <v-expansion-panel-text>
              <!-- Parent Permissions -->
              <div class="mb-4">
                <p class="text-caption text-medium-emphasis font-weight-bold mb-2 ml-12">
                  Permisos Generales
                </p>
                <div class="permission-actions ml-12">
                  <v-checkbox
                    v-for="action in module.actions"
                    :key="`${moduleId}-${action}`"
                    :model-value="hasPermission(`${moduleId}.${action}`)"
                    :label="getActionLabel(action)"
                    hide-details
                    density="compact"
                    @update:model-value="togglePermission(moduleId, action)"
                  >
                    <template #label>
                      <div class="d-flex align-center">
                        <v-icon size="18" :color="getActionColor(action)" class="mr-2">
                          {{ getActionIcon(action) }}
                        </v-icon>
                        <span>{{ getActionLabel(action) }}</span>
                      </div>
                    </template>
                  </v-checkbox>
                </div>
              </div>

              <!-- Child Permissions -->
              <div v-if="module.children" class="child-permissions ml-8">
                <v-divider class="mb-4" />
                <p class="text-caption text-medium-emphasis font-weight-bold mb-3 ml-4">
                  Permisos Específicos
                </p>
                
                <div
                  v-for="(child, childId) in module.children"
                  :key="childId"
                  class="child-permission-group mb-4"
                >
                  <div class="d-flex align-center mb-2 ml-4">
                    <v-checkbox
                      :model-value="isChildFullySelected(childId)"
                      :indeterminate="isChildPartiallySelected(childId)"
                      hide-details
                      density="compact"
                      @update:model-value="toggleEntireChild(childId, child.actions)"
                    />
                    <v-icon :icon="child.icon" size="20" class="mx-2" />
                    <div>
                      <div class="text-subtitle-2 font-weight-medium">
                        {{ child.label }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ child.description }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="permission-actions ml-16">
                    <v-checkbox
                      v-for="action in child.actions"
                      :key="`${childId}-${action}`"
                      :model-value="hasPermission(`${childId}.${action}`)"
                      hide-details
                      density="compact"
                      @update:model-value="togglePermission(childId, action)"
                    >
                      <template #label>
                        <div class="d-flex align-center">
                          <v-icon size="16" :color="getActionColor(action)" class="mr-2">
                            {{ getActionIcon(action) }}
                          </v-icon>
                          <span class="text-body-2">{{ getActionLabel(action) }}</span>
                        </div>
                      </template>
                    </v-checkbox>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- No results -->
        <div v-if="Object.keys(filteredModules).length === 0" class="text-center pa-8">
          <v-icon size="64" color="grey">mdi-magnify</v-icon>
          <p class="text-h6 text-medium-emphasis mt-4">
            No se encontraron permisos
          </p>
        </div>
      </v-card-text>
    </v-card>

    <!-- Summary Dialog -->
    <v-dialog v-model="summaryDialog" max-width="700">
      <v-card>
        <v-card-title>Resumen de Permisos</v-card-title>
        <v-divider />
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="summary in permissionsSummary"
              :key="summary.id"
            >
              <template #prepend>
                <v-avatar :color="summary.color">
                  <v-icon :icon="summary.icon" />
                </v-avatar>
              </template>
              <v-list-item-title>{{ summary.label }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ summary.active }} de {{ summary.total }} permisos activos
              </v-list-item-subtitle>
              <template #append>
                <v-icon
                  :color="summary.isFullyActive ? 'success' : summary.isActive ? 'warning' : 'grey'"
                  :icon="summary.isFullyActive ? 'mdi-check-circle' : summary.isActive ? 'mdi-minus-circle' : 'mdi-close-circle'"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="summaryDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'
import { useNotification } from '@/composables/useNotification'
import { PERMISSION_ACTION_LABELS } from '@/config/permissions.config'

const route = useRoute()
const router = useRouter()
const { notify } = useNotification()

const {
  userPermissions,
  selectedPreset,
  permissionStats,
  permissionsSummary,
  detectedPreset,
  initializePermissions,
  applyRolePreset,
  togglePermission,
  toggleModule,
  hasPermission,
  hasModulePermission,
  getModuleActivePermissions,
  exportPermissions,
  PERMISSIONS_TREE,
  ROLE_PRESETS,
} = usePermissions()

// State
const saving = ref(false)
const editingUser = ref(null)
const searchQuery = ref('')
const expandedPanels = ref([])
const summaryDialog = ref(false)

// Computed
const filteredModules = computed(() => {
  if (!searchQuery.value) return PERMISSIONS_TREE

  const query = searchQuery.value.toLowerCase()
  const filtered = {}

  Object.entries(PERMISSIONS_TREE).forEach(([key, module]) => {
    if (
      module.label.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query)
    ) {
      filtered[key] = module
    }
  })

  return filtered
})

// Methods
async function loadUserPermissions() {
  const userId = route.params.userId
  if (!userId) {
    notify({
      type: 'error',
      message: 'ID de usuario no válido',
    })
    return
  }

  try {
    // TODO: Replace with API call
    // const response = await api.get(`/tenant/users/${userId}/permissions`)
    // editingUser.value = response.data.user
    // initializePermissions(response.data.permissions, response.data.role)

    // Mock data
    editingUser.value = {
      id: userId,
      name: 'María González',
      email: 'maria@example.com',
      role: 'staff',
    }

    // Cargar permisos del preset
    applyRolePreset('staff')
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al cargar permisos del usuario',
    })
  }
}

function applyPreset(presetKey) {
  applyRolePreset(presetKey)
  
  // Expand all panels when preset is applied
  expandedPanels.value = Object.keys(PERMISSIONS_TREE)
  
  notify({
    type: 'success',
    message: `Preset "${ROLE_PRESETS[presetKey].label}" aplicado`,
  })
}

function toggleEntireModule(moduleId) {
  const isFullySelected = isModuleFullySelected(moduleId)
  toggleModule(moduleId, !isFullySelected)
}

function toggleEntireChild(childId, actions) {
  const isFullySelected = isChildFullySelected(childId)
  
  actions.forEach(action => {
    const permKey = `${childId}.${action}`.replace('.', '_')
    if (isFullySelected) {
      delete userPermissions.value[permKey]
    } else {
      userPermissions.value[permKey] = true
    }
  })
}

function isModuleFullySelected(moduleId) {
  const module = PERMISSIONS_TREE[moduleId]
  if (!module) return false

  const allPerms = [
    ...module.actions.map(a => `${moduleId}.${a}`),
  ]

  if (module.children) {
    Object.entries(module.children).forEach(([childId, child]) => {
      child.actions.forEach(a => allPerms.push(`${childId}.${a}`))
    })
  }

  return allPerms.every(perm => hasPermission(perm))
}

function isModulePartiallySelected(moduleId) {
  if (isModuleFullySelected(moduleId)) return false
  return hasModulePermission(moduleId)
}

function isChildFullySelected(childId) {
  const module = Object.values(PERMISSIONS_TREE).find(m => 
    m.children && m.children[childId]
  )
  
  if (!module) return false
  
  const child = module.children[childId]
  return child.actions.every(action => hasPermission(`${childId}.${action}`))
}

function isChildPartiallySelected(childId) {
  if (isChildFullySelected(childId)) return false
  
  const module = Object.values(PERMISSIONS_TREE).find(m => 
    m.children && m.children[childId]
  )
  
  if (!module) return false
  
  const child = module.children[childId]
  return child.actions.some(action => hasPermission(`${childId}.${action}`))
}

function getModuleActiveCount(moduleId) {
  let count = 0
  const module = PERMISSIONS_TREE[moduleId]
  
  module.actions.forEach(action => {
    if (hasPermission(`${moduleId}.${action}`)) count++
  })
  
  if (module.children) {
    Object.entries(module.children).forEach(([childId, child]) => {
      child.actions.forEach(action => {
        if (hasPermission(`${childId}.${action}`)) count++
      })
    })
  }
  
  return count
}

function getModuleTotalCount(moduleId) {
  let count = 0
  const module = PERMISSIONS_TREE[moduleId]
  
  count += module.actions.length
  
  if (module.children) {
    Object.values(module.children).forEach(child => {
      count += child.actions.length
    })
  }
  
  return count
}

function getActionLabel(action) {
  return PERMISSION_ACTION_LABELS[action] || action
}

function getActionIcon(action) {
  const icons = {
    view: 'mdi-eye',
    create: 'mdi-plus-circle',
    edit: 'mdi-pencil',
    delete: 'mdi-delete',
    inactivate: 'mdi-close-circle',
  }
  return icons[action] || 'mdi-circle'
}

function getActionColor(action) {
  const colors = {
    view: 'info',
    create: 'success',
    edit: 'warning',
    delete: 'error',
    inactivate: 'orange',
  }
  return colors[action] || 'grey'
}

function selectAll() {
  Object.keys(PERMISSIONS_TREE).forEach(moduleId => {
    toggleModule(moduleId, true)
  })
  notify({ type: 'success', message: 'Todos los permisos seleccionados' })
}

function deselectAll() {
  Object.keys(PERMISSIONS_TREE).forEach(moduleId => {
    toggleModule(moduleId, false)
  })
  notify({ type: 'success', message: 'Todos los permisos deseleccionados' })
}

async function savePermissions() {
  saving.value = true
  try {
    const permissionsData = exportPermissions()
    
    // TODO: Replace with API call
    // await api.put(`/tenant/users/${editingUser.value.id}/permissions`, {
    //   permissions: permissionsData,
    //   role: selectedPreset.value
    // })

    notify({
      type: 'success',
      message: 'Permisos guardados exitosamente',
    })
    
    // Return to users page after 1 second
    setTimeout(() => {
      router.push({ name: 'users-management' })
    }, 1000)
  } catch (error) {
    notify({
      type: 'error',
      message: 'Error al guardar permisos',
    })
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push({ name: 'users-management' })
}

// Lifecycle
onMounted(() => {
  loadUserPermissions()
  // Expand all panels by default
  expandedPanels.value = Object.keys(PERMISSIONS_TREE)
})
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}

.cursor-pointer {
  cursor: pointer;
}

.permission-panels :deep(.v-expansion-panel-text__wrapper) {
  padding: 16px 0;
}

.permission-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.child-permissions {
  background-color: rgba(0, 0, 0, 0.02);
  border-left: 3px solid rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 4px;
}

.child-permission-group {
  background-color: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
</style>