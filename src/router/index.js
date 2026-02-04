import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layauts/AuthLayout.vue'

import Login from '../views/authe/Login.vue'
import ForgotPassword from '../views/authe/ForgotPassword.vue'
import ResetPassword from '../views/authe/ResetPassword.vue'

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
]

export default createRouter({
  history: createWebHistory(),
  routes,
})