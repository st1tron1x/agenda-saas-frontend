import { ref } from 'vue'
import { ROLES } from '../constants/roles'

const user = ref({
  id: 1,
  name: 'Stiven',
  role: ROLES.SUPER_ADMIN, // ← cambia aquí para probar
})

export function useAuth() {
  return {
    user,
    role: user.value.role,
    isSuperAdmin: user.value.role === ROLES.SUPER_ADMIN,
  }
}
