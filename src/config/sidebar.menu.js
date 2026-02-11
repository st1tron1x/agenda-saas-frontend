import { ROLES } from '../constants/roles'
import { PERMISSIONS } from '../constants/permissions'

export const SIDEBAR_MENU = {
  [ROLES.SUPER_ADMIN]: [
    { title: 'Dashboard', to: '/platform', exact: true, icon: 'mdi-view-dashboard' },
    { title: 'Tenants', to: '/platform/tenants', icon: 'mdi-domain', permission: PERMISSIONS.TENANT_VIEW },
    { title: 'Planes', to: '/platform/plans', icon: 'mdi-domain', },
    { title: 'Soporte', to: '/platform/support', icon: 'mdi-domain', },
    { title: 'Usuarios', to: '/platform/users', icon: 'mdi-account-cog', },
  ],

  [ROLES.TENANT_ADMIN]: [
    { title: 'Dashboard', to: '/app', exact: true, icon: 'mdi-view-dashboard' },
    { title: 'Agenda', to: '/app/agenda', icon: 'mdi-calendar' },
    { title: 'Clientes', to: '/app/clients', icon: 'mdi-group' },
    { title: 'Servicios', to: '/app/services', icon: 'mdi-domain' },
    { title: 'Usuarios', to: '/app/users', icon: 'mdi-account-cog', },
  ],

  [ROLES.STAFF]: [
    { title: 'Dashboard', to: '/app', exact: true, icon: 'mdi-view-dashboard' },
    { title: 'Agenda', to: '/app/agenda', icon: 'mdi-calendar' },
    { title: 'Clientes', to: '/app/clients', icon: 'mdi-account-group' },
  ],
}