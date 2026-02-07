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
          label="Correo o usuario"
          variant="outlined"
        />

        <v-text-field
          v-model="password"
          label="Contraseña"
          type="password"
          variant="outlined"
        />

        <v-btn
          type="submit"
          block
          color="primary"
          class="mt-4"
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

const email = ref('')
const password = ref('')

const auth = useAuth()
const router = useRouter()

function submit() {
 // 🔐 MOCK LOGIN (luego será API)
  auth.login({
    id: 1,
    name: 'Stiven',
    email: 'admin@techsolution.com',
    role: ROLES.SUPER_ADMIN,
    tenantId: null,
  })
  router.push('/platform')

 /* auth.login({
    id: 2,
    name: 'Laura',
    email: 'laura@gloriaosorio.com',
    role: ROLES.STAFF, // 👈 ESTO
    tenantId: null,
  })
  router.push('/app/staff')*/
}
</script>
