import { computed, ref } from 'vue'
import {
  createPlatformUser,
  listPlatformUsers,
  removePlatformUser,
  updatePlatformUser,
  updatePlatformUserPermissions,
} from '@/services/platformUsers.service'

export const PLATFORM_ROLE_OPTIONS = [
  { title: 'Super Admin', value: 'SUPER_ADMIN' },
  { title: 'Admin de tenants', value: 'TENANT_ADMIN_MANAGER' },
  { title: 'Soporte', value: 'SUPPORT_AGENT' },
]

export const PLATFORM_PERMISSION_OPTIONS = [
  { key: 'tenants.view', label: 'Ver tenants' },
  { key: 'tenants.edit', label: 'Editar tenants' },
  { key: 'tenants.billing.view', label: 'Ver facturación' },
  { key: 'users.view', label: 'Ver usuarios internos' },
  { key: 'users.manage', label: 'Gestionar usuarios internos' },
  { key: 'support.manage', label: 'Gestionar soporte' },
]

export function usePlatformUsers() {
  const users = ref([])
  const loading = ref(false)
  const filters = ref({
    search: '',
    role: null,
    status: null,
  })

  const stats = computed(() => ({
    total: users.value.length,
    active: users.value.filter(user => user.status === 'active').length,
    invited: users.value.filter(user => user.status === 'invited').length,
    superAdmins: users.value.filter(user => user.role === 'SUPER_ADMIN').length,
  }))

  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      const matchSearch = !filters.value.search
        || user.name.toLowerCase().includes(filters.value.search.toLowerCase())
        || user.email.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchRole = !filters.value.role || user.role === filters.value.role
      const matchStatus = !filters.value.status || user.status === filters.value.status

      return matchSearch && matchRole && matchStatus
    })
  })

  async function loadUsers() {
    loading.value = true
    try {
      users.value = await listPlatformUsers()
    } finally {
      loading.value = false
    }
  }

  async function saveUser(payload, editingUserId = null) {
    if (editingUserId) {
      const updated = await updatePlatformUser(editingUserId, payload)
      const index = users.value.findIndex(user => user.id === editingUserId)
      if (index !== -1) users.value[index] = updated
      return updated
    }

    const created = await createPlatformUser(payload)
    users.value.unshift(created)
    return created
  }

  async function deleteUser(userId) {
    await removePlatformUser(userId)
    users.value = users.value.filter(user => user.id !== userId)
  }

  async function savePermissions(userId, permissions) {
    const updated = await updatePlatformUserPermissions(userId, permissions)
    const index = users.value.findIndex(user => user.id === userId)
    if (index !== -1) users.value[index] = updated
    return updated
  }

  function clearFilters() {
    filters.value = { search: '', role: null, status: null }
  }

  return {
    users,
    loading,
    filters,
    stats,
    filteredUsers,
    loadUsers,
    saveUser,
    deleteUser,
    savePermissions,
    clearFilters,
  }
}