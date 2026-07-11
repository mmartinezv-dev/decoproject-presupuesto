<script setup lang="ts">
import { ref } from 'vue'
import { useColorMode } from '@vueuse/core'
import { Toaster } from 'vue-sonner'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import CommandPalette from './CommandPalette.vue'

const mode = useColorMode()
const isDark = ref(mode.value === 'dark')

function toggleDark() {
  isDark.value = !isDark.value
  mode.value = isDark.value ? 'dark' : 'light'
}

const sidebarCollapsed = ref(false)
const commandOpen = ref(false)
</script>

<template>
  <div class="flex h-screen overflow-hidden print:h-auto print:overflow-visible bg-zinc-50 font-sans antialiased dark:bg-zinc-950">
    <!-- Sidebar -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />

    <!-- Main -->
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden print:overflow-visible">
      <AppHeader
        :is-dark="isDark"
        @toggle-dark="toggleDark"
        @open-command="commandOpen = true"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto print:overflow-visible">
        <slot />
      </main>
    </div>

    <!-- Command palette -->
    <CommandPalette v-model:open="commandOpen" />

    <!-- Toast notifications -->
    <Toaster
      position="bottom-right"
      :theme="isDark ? 'dark' : 'light'"
      :toast-options="{
        style: { fontFamily: 'Inter, sans-serif' },
      }"
      rich-colors
    />
  </div>
</template>
