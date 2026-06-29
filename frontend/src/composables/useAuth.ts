import { useAuthStore } from '../core/auth/useAuthStore'

export function useAuth() {
  const store = useAuthStore()
  return {
    isLoggedIn: store.isLoggedIn,
    setToken: (t: string) => store.setToken(t),
    logout: () => store.logout(),
    getToken: () => store.getToken(),
  }
}
