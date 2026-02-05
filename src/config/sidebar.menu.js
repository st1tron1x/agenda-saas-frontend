import { ROLES } from '../constants/roles'
import { PERMISSIONS } from '../constants/permissions'

export const SIDEBAR_MENU = {
  [ROLES.SUPER_ADMIN]: [
    { title: 'Dashboard', to: '/platform', exact: true },
    { title: 'Tenants', to: '/platform/tenants', permission: PERMISSIONS.TENANT_VIEW },
    { title: 'Planes', to: '/platform/plans' },
    { title: 'Soporte', to: '/platform/support' },
    { title: 'Usuarios', to: '/app/users' },
  ],

  [ROLES.TENANT_ADMIN]: [
    { title: 'Dashboard', to: '/app', exact: true },
    { title: 'Agenda', to: '/app/agenda' },
    { title: 'Clientes', to: '/app/clients' },
    { title: 'Servicios', to: '/app/services' },
    { title: 'Usuarios', to: '/app/users' },
  ],

  [ROLES.STAFF]: [
    { title: 'Dashboard', to: '/app', exact: true },
    { title: 'Agenda', to: '/app/agenda' },
    { title: 'Clientes', to: '/app/clients' },
  ],
}