<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { X } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { api } from '../../composables/useApi'
import FormField from '../../shared/ui/FormField.vue'
import type { Category, Product } from '../../types'

const props = defineProps<{
  open: boolean
  initialName?: string
}>()

const emit = defineEmits<{
  close: []
  created: [product: Product]
}>()

const UNITS = ['un', 'mt2', 'mt', 'ml', 'kg', 'gl', 'lt', 'm3']

const categories = ref<Category[]>([])
const saving = ref(false)
const nameInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
  name: '',
  description: '',
  unit: 'un' as string,
  price: 0,
  categoryId: undefined as number | undefined,
})

// Reset + pre-fill whenever modal opens
watch(() => props.open, async (val) => {
  if (!val) return
  form.value = {
    name: props.initialName ?? '',
    description: '',
    unit: 'un',
    price: 0,
    categoryId: undefined,
  }
  // Focus name input after transition
  setTimeout(() => nameInputRef.value?.focus(), 50)
})

onMounted(async () => {
  categories.value = await api.get<Category[]>('/categories')
})

async function submit() {
  if (!form.value.name.trim()) return
  saving.value = true
  try {
    const created = await api.post<Product>('/products', form.value)
    toast.success(`Producto "${created.name}" creado`)
    emit('created', created)
    emit('close')
  } catch {
    toast.error('Error al crear el producto. Intentá de nuevo.')
  } finally {
    saving.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
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
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="emit('close')"
        @keydown="onKeydown"
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
            class="relative z-10 w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
              <div>
                <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Nuevo producto</h2>
                <p class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Se agregará al catálogo y quedará disponible de inmediato</p>
              </div>
              <button
                class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                @click="emit('close')"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <!-- Form -->
            <form class="space-y-4 p-5" @submit.prevent="submit">
              <!-- Nombre -->
              <FormField label="Nombre" required>
                <input
                  ref="nameInputRef"
                  v-model="form.name"
                  required
                  placeholder="Ej: Pintura látex premium"
                  class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                />
              </FormField>

              <!-- Categoría + Unidad -->
              <div class="grid grid-cols-2 gap-3">
                <FormField label="Categoría">
                  <select
                    v-model.number="form.categoryId"
                    class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option :value="undefined">Sin categoría</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </FormField>

                <FormField label="Unidad">
                  <select
                    v-model="form.unit"
                    class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
                  </select>
                </FormField>
              </div>

              <!-- Precio -->
              <FormField label="Precio unitario">
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                />
              </FormField>

              <!-- Descripción -->
              <FormField label="Descripción">
                <input
                  v-model="form.description"
                  placeholder="Opcional"
                  class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                />
              </FormField>

              <!-- Actions -->
              <div class="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  class="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  @click="emit('close')"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="saving || !form.name.trim()"
                  class="rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-900 disabled:opacity-50"
                >
                  {{ saving ? 'Guardando...' : 'Crear y usar producto' }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
