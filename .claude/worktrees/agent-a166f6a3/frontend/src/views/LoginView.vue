<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { setToken } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    if (!res.ok) {
      error.value = 'Usuario o contraseña incorrectos'
      return
    }
    const { token } = await res.json()
    setToken(token)
    router.push('/')
  } catch {
    error.value = 'Error de conexión. Intentá de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">
          <span class="text-blue-600">Presupuestos</span> Constru
        </h1>
        <p class="text-sm text-slate-400 mt-1">Iniciá sesión para continuar</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>
