import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '../layauts/AuthLayout.vue'
import PlatformLayout from '../layauts/PlatformLayout.vue'

import Login from '../modules/auth/pages/Login.vue'
import ForgotPassword from '../modules/auth/pages/ForgotPassword.vue'
import ResetPassword from '../modules/auth/pages/ResetPassword.vue'

const routes = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: Login },
      { path: 'forgot-password', component: ForgotPassword },
      { path: 'reset-password', component: ResetPassword },
    ],
  },

  {
    path: '/platform',
    component: PlatformLayout,
    children: [
      {
        path: '',
        name: 'PlatformDashboard',
        component: () =>
          import('../modules/platform/pages/Dashboard.vue'),
      },
      {
        path: 'tenants',
        name: 'TenantsList',
        component: () =>
          import('../modules/platform/pages/TenantsList.vue'),
      },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})