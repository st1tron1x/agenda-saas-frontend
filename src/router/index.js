import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth'

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
    meta: {
      requiresAuth: true,
      role: 'super_admin',
    },
    children: [
      {
        path: '',
        name: 'PlatformDashboard',
        component: () => import('../modules/platform/pages/Dashboard.vue'),
      },
      {
        path: 'tenants',
        name: 'TenantsList',
        component: () => import('../modules/platform/pages/TenantsList.vue'),
      },
      {
        path: '/platform/tenants/create',
        name: 'TenantCreate',
        component: ()=> import('@/modules/platform/pages/TenantCreate.vue'),
        meta: {role: 'super_admin'},
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { state } = useAuth()

  if (to.meta.requiresAuth && !state.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.role && state.user?.role !== to.meta.role) {
    return next('/login')
  }

  next()
})

export default router
