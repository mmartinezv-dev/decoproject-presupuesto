<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../core/auth/useAuthStore'
import {
  Building2,
  FileText,
  FilePlus,
  Package,
  Tag,
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from '@lucide/vue'

const props = defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const navGroups = [
  {
    label: 'Presupuestos',
    items: [
      { label: 'Historial',         to: '/presupuestos',       icon: FileText },
      { label: 'Nuevo presupuesto', to: '/presupuestos/nuevo', icon: FilePlus },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      { label: 'Productos',   to: '/productos',  icon: Package },
      { label: 'Categorías',  to: '/categorias', icon: Tag     },
      { label: 'Clientes',    to: '/clientes',   icon: Users   },
    ],
  },
]

function isActive(to: string): boolean {
  if (to === '/presupuestos/nuevo') return route.path === to
  if (to === '/presupuestos')
    return route.path.startsWith('/presupuestos') && route.path !== '/presupuestos/nuevo'
  return route.path.startsWith(to)
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
  auth.logout()
  router.push('/login')
}

const sidebarWidth = computed(() => (props.collapsed ? 'w-[64px]' : 'w-[240px]'))
</script>

<template>
  <aside
    class="no-print relative flex h-screen shrink-0 flex-col border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900"
    :class="sidebarWidth"
  >
    <!-- Logo -->
    <div class="flex h-14 shrink-0 items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
      <div class="flex min-w-0 items-center gap-3">
        <!-- Icon -->
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
          <Building2 class="h-4 w-4" />
        </div>
        <!-- Name -->
        <div
          class="overflow-hidden transition-all duration-300"
          :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'"
        >
          <span class="block whitespace-nowrap text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            DecoProject
          </span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-x-hidden overflow-y-auto p-2 py-3">
      <div v-for="group in navGroups" :key="group.label" class="mb-4">
        <!-- Section label -->
        <div
          class="overflow-hidden transition-all duration-200"
          :class="collapsed ? 'max-h-0 opacity-0' : 'max-h-8 opacity-100'"
        >
          <p class="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {{ group.label }}
          </p>
        </div>

        <!-- Nav items -->
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :title="collapsed ? item.label : undefined"
          class="relative mb-0.5 flex items-center rounded-md py-2 text-sm font-medium transition-colors duration-150"
          :class="[
            collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            isActive(item.to)
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
          ]"
        >
          <!-- Active pill -->
          <span
            v-if="isActive(item.to) && !collapsed"
            class="absolute left-0 top-1/2 h-[18px] w-0.5 -translate-y-1/2 rounded-full bg-brand-600 dark:bg-brand-400"
          />
          <!-- Icon -->
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <!-- Label -->
          <span
            class="overflow-hidden whitespace-nowrap transition-all duration-300"
            :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'"
          >
            {{ item.label }}
          </span>
        </RouterLink>
      </div>
    </nav>

    <!-- Footer -->
    <div class="shrink-0 border-t border-zinc-200 p-2 dark:border-zinc-800">
      <!-- Logout -->
      <button
        :title="collapsed ? 'Cerrar sesión' : undefined"
        class="mb-1 flex w-full items-center rounded-md py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        :class="collapsed ? 'justify-center px-0' : 'gap-3 px-3'"
        @click="logout"
      >
        <LogOut class="h-4 w-4 shrink-0" />
        <span
          class="overflow-hidden whitespace-nowrap transition-all duration-300"
          :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'"
        >
          Cerrar sesión
        </span>
      </button>

      <!-- Collapse toggle -->
      <button
        class="flex w-full items-center justify-center rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        :title="collapsed ? 'Expandir menú' : 'Colapsar menú'"
        @click="emit('toggle')"
      >
        <PanelLeftClose v-if="!collapsed" class="h-4 w-4" />
        <PanelLeftOpen v-else class="h-4 w-4" />
      </button>
    </div>
  </aside>
</template>
