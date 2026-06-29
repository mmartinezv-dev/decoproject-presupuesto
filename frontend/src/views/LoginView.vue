<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../core/auth/useAuthStore'
import { Building2, Loader2 } from '@lucide/vue'

const router = useRouter()
const auth   = useAuthStore()

const username = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)

async function login() {
  error.value   = ''
  loading.value = true
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    if (!res.ok) {
      error.value = 'Usuario o contraseña incorrectos'
      return
    }
    const { accessToken } = await res.json()
    auth.setToken(accessToken)
    router.push('/')
  } catch {
    error.value = 'Error de conexión. Intentá de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-500/30">
          <Building2 class="h-6 w-6 text-white" />
        </div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">DecoProject</h1>
        <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Iniciá sesión para continuar</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <form class="space-y-4" @submit.prevent="login">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Usuario
            </label>
            <input
              v-model="username"
              type="text"
              autocomplete="username"
              required
              placeholder="admin"
              class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-brand-400"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Contraseña
            </label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-brand-400"
            />
          </div>

          <!-- Error -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {{ error }}
            </p>
          </Transition>

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60 dark:focus:ring-offset-zinc-900"
          >
            <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
