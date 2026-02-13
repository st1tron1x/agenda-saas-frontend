<template>
  <v-card width="420" elevation="6">
    <v-card-title class="text-h6 text-center">
      Iniciar sesión
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submit">
        <v-text-field
          v-model="email"
          :rules="[v => !!v || 'Campo requerido', v => /.+@.+/.test(v) || 'Email inválido']"
          label="Correo"
          variant="outlined"
        />

        <v-text-field
          v-model="password"
          label="Contraseña"
          type="password"
          variant="outlined"
        />

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-3"
        >
          {{ errorMessage }}
        </v-alert>

        <v-btn
          type="submit"
          block
          color="primary"
          class="mt-2"
          :loading="loading"
        >
          Entrar
        </v-btn>

        <v-btn
          variant="text"
          block
          class="mt-2"
          to="/forgot-password"
        >
          ¿Olvidaste tu contraseña?
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { ROLES } from '@/constants/roles'
import { authService } from '@/services/auth.service'

const email = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')

const auth = useAuth()
const router = useRouter()

/*function submit() {
 // 🔐 MOCK LOGIN (luego será API)
  auth.login({
    id: 1,
    name: 'Stiven',
    email: 'admin@techsolution.com',
    role: ROLES.SUPER_ADMIN,
    tenantId: null,
  })
  router.push('/platform')*/
function redirectByRole(role) {
  if (role === ROLES.SUPER_ADMIN) {
    router.push('/platform')
    return
  }

  if (role === ROLES.STAFF) {
    router.push('/app/staff')
    return
  }

  router.push('/app')
}

async function submit() {
  errorMessage.value = ''
  loading.value = true

  try {
    const result = await authService.login(email.value, password.value)

    if (!result.success) {
      errorMessage.value = result.error || 'No se pudo iniciar sesión'
      return
    }
 /* auth.login({
    id: 2,
    name: 'Laura',
    email: 'laura@gloriaosorio.com',
    role: ROLES.STAFF, // 👈 ESTO
    tenantId: null,
  })
  router.push('/app/staff')*/
  auth.login({ ...result.user, token: result.token, refreshToken: result.refreshToken })
    redirectByRole(result.user.role)
  } catch (error) {
    errorMessage.value = error.message || 'Error inesperado al iniciar sesión'
  } finally {
    loading.value = false
  }

}
</script>