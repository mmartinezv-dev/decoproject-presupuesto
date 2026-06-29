<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from './core/auth/useAuthStore'
import AppLayout from './components/layout/AppLayout.vue'

const route = useRoute()
const auth  = useAuthStore()

const isPublicRoute = () => route.meta.public === true
</script>

<template>
  <!-- Public routes (login) — sin layout -->
  <RouterView v-if="!auth.isLoggedIn || isPublicRoute()" :key="route.fullPath" />

  <!-- Rutas protegidas — con sidebar + header -->
  <AppLayout v-else>
    <RouterView :key="route.fullPath" />
  </AppLayout>
</template>
