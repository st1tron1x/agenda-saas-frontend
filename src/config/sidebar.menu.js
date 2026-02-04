import { ROLES } from '../constants/roles'

export const SIDEBAR_MENU = {
  [ROLES.SUPER_ADMIN]: [
    { title: 'Dashboard', to: '/platform' },
    { title: 'Tenants', to: '/platform/tenants' },
    { title: 'Planes', to: '/platform/plans' },
    { title: 'Soporte', to: '/platform/support' },
  ],

  [ROLES.TENANT_ADMIN]: [
    { title: 'Dashboard', to: '/app' },
    { title: 'Agenda', to: '/app/agenda' },
    { title: 'Clientes', to: '/app/clients' },
    { title: 'Servicios', to: '/app/services' },
    { title: 'Usuarios', to: '/app/users' },
  ],

  [ROLES.STAFF]: [
    { title: 'Agenda', to: '/app/agenda' },
    { title: 'Clientes', to: '/app/clients' },
  ],
}