<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, FileText, FilePlus, Package, Tag, Users, ArrowRight } from '@lucide/vue'

const open = defineModel<boolean>('open', { required: true })

const router = useRouter()
const query  = ref('')
const cursor = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const commands = [
  { label: 'Nuevo presupuesto', icon: FilePlus,  group: 'Presupuestos', to: '/presupuestos/nuevo', shortcut: 'N' },
  { label: 'Historial',         icon: FileText,  group: 'Presupuestos', to: '/presupuestos'        },
  { label: 'Productos',         icon: Package,   group: 'Catálogo',     to: '/productos'           },
  { label: 'Categorías',        icon: Tag,       group: 'Catálogo',     to: '/categorias'          },
  { label: 'Clientes',          icon: Users,     group: 'Catálogo',     to: '/clientes'            },
]

const filtered = computed(() => {
  if (!query.value) return commands
  const q = query.value.toLowerCase()
  return commands.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
})

function close() {
  open.value = false
  query.value = ''
  cursor.value = 0
}

function run(index: number) {
  const cmd = filtered.value[index]
  if (!cmd) return
  router.push(cmd.to)
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    cursor.value = (cursor.value + 1) % filtered.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    cursor.value = (cursor.value - 1 + filtered.value.length) % filtered.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    run(cursor.value)
  } else if (e.key === 'Escape') {
    close()
  }
}

// Reset cursor on query change
watch(query, () => { cursor.value = 0 })

// Focus input when opened
watch(open, async (val) => {
  if (val) {
    await nextTick()
    inputRef.value?.focus()
  }
})

// Global Ctrl+K / Cmd+K shortcut
function onGlobalKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKey))
onUnmounted(() => window.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 dark:bg-black/60" />

        <!-- Panel -->
        <Transition
          enter-active-class="duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="duration-100 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
          appear
        >
          <div
            class="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
            @keydown="onKeydown"
          >
            <!-- Search input -->
            <div class="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-700">
              <Search class="h-4 w-4 shrink-0 text-zinc-400" />
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                placeholder="Buscar sección, acción..."
                class="h-12 flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
              />
              <kbd class="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                ESC
              </kbd>
            </div>

            <!-- Results -->
            <div class="max-h-72 overflow-y-auto p-2">
              <template v-if="filtered.length">
                <div v-for="(cmd, i) in filtered" :key="cmd.to">
                  <button
                    class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                    :class="cursor === i
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'"
                    @mouseenter="cursor = i"
                    @click="run(i)"
                  >
                    <div
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                      :class="cursor === i
                        ? 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'"
                    >
                      <component :is="cmd.icon" class="h-3.5 w-3.5" />
                    </div>

                    <div class="min-w-0 flex-1">
                      <p class="font-medium">{{ cmd.label }}</p>
                      <p class="text-xs text-zinc-400 dark:text-zinc-500">{{ cmd.group }}</p>
                    </div>

                    <div class="flex items-center gap-1.5">
                      <kbd
                        v-if="cmd.shortcut"
                        class="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
                      >
                        {{ cmd.shortcut }}
                      </kbd>
                      <ArrowRight class="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
                    </div>
                  </button>
                </div>
              </template>

              <!-- Empty state -->
              <div v-else class="py-8 text-center">
                <p class="text-sm text-zinc-400 dark:text-zinc-500">Sin resultados para "{{ query }}"</p>
              </div>
            </div>

            <!-- Footer hint -->
            <div class="border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
              <p class="text-[11px] text-zinc-400 dark:text-zinc-500">
                <kbd class="font-mono">↑↓</kbd> navegar &nbsp;·&nbsp;
                <kbd class="font-mono">↵</kbd> abrir &nbsp;·&nbsp;
                <kbd class="font-mono">ESC</kbd> cerrar
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
