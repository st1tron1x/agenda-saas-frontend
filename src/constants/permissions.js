/*//src/constants/permissions.js
export const PERMISSIONS = {
  // Plataforma
  TENANT_VIEW: 'TENANT_VIEW',
  TENANT_CREATE: 'TENANT_CREATE',
  TENANT_EDIT: 'TENANT_EDIT',
  TENANT_PAUSE: 'TENANT_PAUSE',

  PLAN_VIEW: 'PLAN_VIEW',
  PLAN_EDIT: 'PLAN_EDIT',

  // Tenant
  APPOINTMENT_VIEW: 'APPOINTMENT_VIEW',
  APPOINTMENT_CREATE: 'APPOINTMENT_CREATE',
  APPOINTMENT_EDIT: 'APPOINTMENT_EDIT',

  CLIENT_VIEW: 'CLIENT_VIEW',
  CLIENT_CREATE: 'CLIENT_CREATE',
  CLIENT_EDIT: 'CLIENT_EDIT',

  SERVICE_CREATE: 'SERVICE_CREATE',
  SERVICE_VIEW: 'SERVICE_VIEW',
  SERVICE_EDIT: 'SERVICE_EDIT',

  USER_VIEW: 'USER_VIEW',
  USER_EDIT: 'USER_EDIT',

  // Dashboard
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
}*/
export const PERMISSIONS = [
  {
    key: 'agenda',
    label: 'Agenda',
    children: [
      { key: 'agenda.view', label: 'Ver' },
      { key: 'agenda.create', label: 'Crear' },
      { key: 'agenda.edit', label: 'Editar' },
      { key: 'agenda.cancel', label: 'Cancelar' },
    ],
  },
  {
    key: 'clients',
    label: 'Clientes',
    children: [
      { key: 'clients.view', label: 'Ver' },
      { key: 'clients.create', label: 'Crear' },
      { key: 'clients.edit', label: 'Editar' },
    ],
  },
  {
    key: 'services',
    label: 'Servicios',
    children: [
      { key: 'services.view', label: 'Ver' },
      { key: 'services.manage', label: 'Gestionar' },
    ],
  },
]
