import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
  }

  function logout() {
    token.value = null
  }

  function getToken(): string | null {
    return token.value
  }

  return { isLoggedIn, setToken, logout, getToken }
})
