import { ref, computed } from 'vue'

const TOKEN_KEY = 'auth_token'
const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    localStorage.setItem(TOKEN_KEY, t)
  }

  function logout() {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  function getToken(): string | null {
    return token.value
  }

  return { isLoggedIn, setToken, logout, getToken }
}
