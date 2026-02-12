const mockPlatformUsers = [
  {
    id: 1,
    name: 'María González',
    email: 'maria@agenda.com',
    role: 'SUPER_ADMIN',
    status: 'active',
    tenantScope: 'global',
    lastLoginAt: '2026-02-10T13:20:00.000Z',
    permissions: ['tenants.view', 'tenants.edit', 'users.manage', 'support.manage'],
  },
  {
    id: 2,
    name: 'Diego Rivas',
    email: 'diego@agenda.com',
    role: 'TENANT_ADMIN_MANAGER',
    status: 'active',
    tenantScope: 'multi-tenant',
    lastLoginAt: '2026-02-12T09:05:00.000Z',
    permissions: ['tenants.view', 'tenants.edit', 'tenants.billing.view', 'users.view'],
  },
  {
    id: 3,
    name: 'Sofía Núñez',
    email: 'soporte@agenda.com',
    role: 'SUPPORT_AGENT',
    status: 'invited',
    tenantScope: 'limited',
    lastLoginAt: null,
    permissions: ['tenants.view', 'support.manage'],
  },
]

let idSequence = 100

function clone(item) {
  return JSON.parse(JSON.stringify(item))
}

export async function listPlatformUsers() {
  return clone(mockPlatformUsers)
}

export async function createPlatformUser(payload) {
  const user = {
    ...payload,
    id: idSequence++,
    status: payload.status || 'invited',
    lastLoginAt: null,
  }

  mockPlatformUsers.unshift(user)
  return clone(user)
}

export async function updatePlatformUser(userId, payload) {
  const index = mockPlatformUsers.findIndex(user => user.id === userId)
  if (index === -1) {
    throw new Error('Usuario no encontrado')
  }

  mockPlatformUsers[index] = {
    ...mockPlatformUsers[index],
    ...payload,
  }

  return clone(mockPlatformUsers[index])
}

export async function removePlatformUser(userId) {
  const index = mockPlatformUsers.findIndex(user => user.id === userId)
  if (index === -1) {
    return false
  }

  mockPlatformUsers.splice(index, 1)
  return true
}

export async function updatePlatformUserPermissions(userId, permissions) {
  return updatePlatformUser(userId, { permissions })
}