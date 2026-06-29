<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Sun, Moon, Menu } from '@lucide/vue'

defineProps<{ isDark: boolean }>()

const emit = defineEmits<{
  'toggle-dark': []
  'open-command': []
  'toggle-sidebar': []
}>()

const route = useRoute()

const PAGE_TITLES: Record<string, string> = {
  '/presupuestos':       'Presupuestos',
  '/presupuestos/nuevo': 'Nuevo presupuesto',
  '/categorias':         'Categorías',
  '/productos':          'Productos',
  '/clientes':           'Clientes',
}

const pageTitle = computed(() => {
  if (/^\/presupuestos\/\d+$/.test(route.path)) return 'Editar presupuesto'
  return PAGE_TITLES[route.path] ?? 'DecoProject'
})

const isMac = navigator.userAgent.includes('Mac')
const shortcutLabel = isMac ? '⌘K' : 'Ctrl K'
</script>

<template>
  <header class="no-print flex h-14 shrink-0 items-center gap-4 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
    <!-- Mobile sidebar toggle -->
    <button
      class="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:hidden dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      @click="emit('toggle-sidebar')"
    >
      <Menu class="h-5 w-5" />
    </button>

    <!-- Page title -->
    <h1 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      {{ pageTitle }}
    </h1>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Command palette trigger -->
    <button
      class="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
      @click="emit('open-command')"
    >
      <Search class="h-3.5 w-3.5" />
      <span class="hidden sm:inline">Buscar...</span>
      <kbd class="hidden rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline dark:bg-zinc-700 dark:text-zinc-400">
        {{ shortcutLabel }}
      </kbd>
    </button>

    <!-- Dark mode toggle -->
    <button
      class="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      :title="isDark ? 'Modo claro' : 'Modo oscuro'"
      @click="emit('toggle-dark')"
    >
      <Sun v-if="isDark" class="h-4 w-4" />
      <Moon v-else class="h-4 w-4" />
    </button>
  </header>
</template>
