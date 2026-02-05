import { reactive, watch } from 'vue'

const savedAuth = JSON.parse(localStorage.getItem('auth'))

const state = reactive({
  isAuthenticated: savedAuth?.isAuthenticated || false,
  user: savedAuth?.user || null,
})

export function useAuth() {
  function login(userData) {
    state.isAuthenticated = true
    state.user = userData
  }

  function logout() {
    state.isAuthenticated = false
    state.user = null
    localStorage.removeItem('auth')
  }

  // Persistencia automática
  watch(
    () => state,
    () => {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        })
      )
    },
    { deep: true }
  )

  return {
    state,
    login,
    logout,
  }
}