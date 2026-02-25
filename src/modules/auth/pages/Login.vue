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
          :disabled="loading"
        />

        <v-text-field
          v-model="password"
          label="Contraseña"
          type="password"
          variant="outlined"
          :disabled="loading"
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
import { api } from '@/services/api'  // ← Usar el cliente API directo

const email = ref('admin@demo.com')  // ← Valor por defecto para testing
const password = ref('demo123')      // ← Valor por defecto para testing

const loading = ref(false)
const errorMessage = ref('')

const auth = useAuth()
const router = useRouter()

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
    console.log('🔐 Intentando login con:', email.value)
    
    // ⭐ LLAMADA AL BACKEND DJANGO
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    console.log('📦 Respuesta del servidor:', response)

    // Verificar si la respuesta es exitosa
    if (!response.success) {
      errorMessage.value = response.error || 'Credenciales inválidas'
      console.error('❌ Login fallido:', response.error)
      return
    }

    // Extraer datos de la respuesta
    const { user, access_token, refresh_token } = response.data

    console.log('✅ Login exitoso:', user)

    // Guardar tokens en localStorage (por si auth store falla)
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)

    // Mapear el rol del backend al formato del frontend
    let frontendRole = ROLES.TENANT_ADMIN // Default
    
    if (user.role === 'SUPER_ADMIN') {
      frontendRole = ROLES.SUPER_ADMIN
    } else if (user.role === 'STAFF') {
      frontendRole = ROLES.STAFF
    } else if (user.role === 'TENANT_ADMIN') {
      frontendRole = ROLES.TENANT_ADMIN
    }

    // Actualizar el store de autenticación
    auth.login({
      id: user.id,
      name: user.name || `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: frontendRole,
      tenantId: user.tenant_id,
      token: access_token,
      refreshToken: refresh_token
    })

    console.log('🎯 Redirigiendo según rol:', frontendRole)

    // Redirigir según el rol
    redirectByRole(frontendRole)
    
  } catch (error) {
    console.error('❌ Error capturado:', error)
    
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un error
      const serverError = error.response.data?.error || 
                          error.response.data?.message || 
                          'Error del servidor'
      errorMessage.value = serverError
      console.error('Error del servidor:', error.response.status, serverError)
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      errorMessage.value = 'No se pudo conectar con el servidor. Verifica que Django esté corriendo en http://localhost:8000'
      console.error('Sin respuesta del servidor:', error.request)
    } else {
      // Error al configurar la petición
      errorMessage.value = error.message || 'Error inesperado al iniciar sesión'
      console.error('Error de configuración:', error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Estilos opcionales */
</style>