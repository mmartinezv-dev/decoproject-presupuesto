<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, logout } = useAuth()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 print:bg-white">
    <!-- Navbar -->
    <nav v-if="isLoggedIn" class="no-print bg-slate-800 text-white px-6 py-3 flex gap-6 items-center shadow-md">
      <span class="font-bold text-lg tracking-tight">
        <span class="text-blue-400">Presupuestos</span> Constru
      </span>
      <router-link to="/presupuestos/nuevo" class="text-sm text-slate-300 hover:text-blue-400 transition-colors">Nuevo Presupuesto</router-link>
      <router-link to="/presupuestos" class="text-sm text-slate-300 hover:text-blue-400 transition-colors">Historial</router-link>
      <router-link to="/categorias" class="text-sm text-slate-300 hover:text-blue-400 transition-colors">Categorías</router-link>
      <router-link to="/productos" class="text-sm text-slate-300 hover:text-blue-400 transition-colors">Productos</router-link>
      <router-link to="/clientes" class="text-sm text-slate-300 hover:text-blue-400 transition-colors">Clientes</router-link>
      <button @click="handleLogout" class="ml-auto text-sm text-slate-400 hover:text-red-400 transition-colors">
        Cerrar sesión
      </button>
    </nav>

    <main class="max-w-5xl mx-auto p-6 print:p-0 print:max-w-none">
      <router-view :key="route.fullPath" />
    </main>
  </div>
</template>
