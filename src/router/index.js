import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { ROLES } from '@/constants/roles'

import AuthLayout from '@/layauts/AuthLayout.vue'
import PlatformLayout from '@/layauts/PlatformLayout.vue'
import AppLayout from '@/layauts/AppLayout.vue'

import Login from '@/modules/auth/pages/Login.vue'
import ForgotPassword from '@/modules/auth/pages/ForgotPassword.vue'
import ResetPassword from '@/modules/auth/pages/ResetPassword.vue'
import TenantDashboard from '@/modules/tenant/pages/TenantDashboard.vue'

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
      role: ROLES.SUPER_ADMIN,
    },
    children: [
      {
        path: '',
        name: 'PlatformDashboard',
        component: () => import('@/modules/platform/pages/Dashboard.vue'),
      },
      {
        path: 'tenants',
        name: 'TenantsList',
        component: () => import('@/modules/platform/pages/TenantsList.vue'),
      },
      {
        path: 'tenants/create', // ✅ SIN /
        name: 'TenantCreate',
        component: () => import('@/modules/platform/pages/TenantCreate.vue'),
      },
    ],
  },

  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/app/dashboard',
      },
      { path: 'dashboard', component: ()=> import('@/modules/tenant/pages/TenantDashboard.vue'),},
      { path: 'staff', component: () => import('@/modules/tenant/pages/StaffDashboard.vue'), meta:{role:ROLES.STAFF,}},
      { path: 'tv', component: () => import('@/modules/tenant/pages/TvDashboard.vue') },
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

  if (to.meta.permission && !auth.hasPermission(to.meta.permission)) {
    return next('/login') // O mejor: mostrar página 403
  }

  next()
})

export default router
