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
import AgendaPage from '@/modules/tenant/pages/AgendaPage.vue'
import ClientsPage from '@/modules/tenant/pages/ClientsPage.vue'

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
        path: 'tenants/create', 
        name: 'TenantCreate',
        component: () => import('@/modules/platform/pages/TenantCreate.vue'),
      },
      {
        path: 'tenants/:id/edit',
        name: 'TenantEdit',
        component: () => import('@/modules/platform/pages/TenantEdit.vue'),
        props: true,
      },
      {
        path: 'plans',
        name: 'PlatformPlans',
        component: () => import('@/modules/platform/pages/PlansPage.vue'),
        meta: {
          title: 'Gestión de Planes'
        }
      },
      
      {
        path: 'support',
        name: 'PlatformSupport',
        component: () => import('@/modules/platform/pages/SupportPage.vue'),
        meta: {
          title: 'Centro de Soporte'
        }
      },
      {
        path: 'users',
        name: 'PlatformUsers',
        component: () => import('@/modules/platform/pages/PlatformUsersPage.vue'),
        meta: {
          title: 'Usuarios de plataforma'
        }
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
      { path: 'tv', component: () => import('@/modules/tenant/pages/TvDashboard.vue'), meta:{fullscreen: true}},
      { path: 'agenda', component: AgendaPage, meta: {requiresAuth: true}},
      { path: 'clients', component: ()=>import('@/modules/tenant/pages/ClientsPage.vue')},
      { path: 'clients/:id', component: () => import('@/modules/tenant/pages/ClientDetailPage.vue'), props: true,},
      { path: 'services', component: () => import('@/modules/tenant/pages/ServicesPage.vue')},
      { path: 'users', component: () => import('@/modules/tenant/pages/UsersPage.vue'),}
    ],
  } 
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const { state, hasPermission } = useAuth()

  // Cambiar título de la página si está definido
  if (to.meta.title) {
    document.title = `${to.meta.title} - Mi Plataforma`
  }
  // Verificar autenticación
  if (to.meta.requiresAuth && !state.isAuthenticated) {
    return next('/login')
  }
  // Verificar permisos
  if (to.meta.permission && !hasPermission(to.meta.permission)) {
    return next('/login') 
  }

  // Verificar rol (si es necesario)
  if (to.meta.role && state.user?.role !== to.meta.role) {
    // Opcional: redirigir a una página de "no autorizado"
    console.warn('Usuario no tiene el rol necesario')
  }

  next()
})

export default router