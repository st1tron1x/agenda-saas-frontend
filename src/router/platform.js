// src/router/platform.js
const routes = [
{
  path: '/platform',
  component: () => import('@/layouts/PlatformLayout.vue'),
  meta: { requiresAuth: true, role: 'super_admin' },
  children: [
    {
      path: 'tenants',
      name: 'platform-tenants',
      component: () => import('@/views/platform/TenantsPage.vue'),
    },
    {
      path: 'plans',
      name: 'platform-plans',
      component: () => import('@/views/platform/PlansPage.vue'),
    },
    {
      path: 'support',
      name: 'platform-support',
      component: () => import('@/views/platform/SupportPage.vue'),
    },
  ],
}
]