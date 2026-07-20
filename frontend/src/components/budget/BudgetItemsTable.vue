<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from '@lucide/vue'
import type { BudgetItem, Product } from '../../types'
import { useFormat } from '../../composables/useFormat'
import ProductQuickAddModal from './ProductQuickAddModal.vue'

const props = defineProps<{
  sectionIndex: number
  title: string
  items: BudgetItem[]
  manualTotal: number | null
  searchResults: Product[]
  activeSectionIndex: number
  activeRowIndex: number
  canRemove: boolean
}>()

const emit = defineEmits<{
  search: [query: string, sectionIndex: number, rowIndex: number]
  pick: [product: Product, sectionIndex: number, rowIndex: number]
  closeSearch: []
  addRow: [sectionIndex: number]
  removeRow: [sectionIndex: number, rowIndex: number]
  updateItem: [sectionIndex: number, rowIndex: number, field: keyof BudgetItem, value: string | number]
  updateTitle: [sectionIndex: number, title: string]
  updateManualTotal: [sectionIndex: number, total: number | null]
  removeSection: [sectionIndex: number]
}>()

const { clp } = useFormat()

const UNITS = ['un', 'mt2', 'mt', 'ml', 'kg', 'gl', 'lt', 'm3']

// ── Quick-add modal ──────────────────────────────────────────────
const modalOpen        = ref(false)
const modalInitialName = ref('')
const capturedSection  = ref(-1)
const capturedRow      = ref(-1)
const currentQuery     = ref('')

function openAddModal() {
  capturedSection.value  = props.activeSectionIndex
  capturedRow.value      = props.activeRowIndex
  modalInitialName.value = currentQuery.value
  emit('closeSearch')
  modalOpen.value = true
}

function handleProductCreated(product: Product) {
  if (capturedRow.value >= 0) {
    emit('pick', product, capturedSection.value, capturedRow.value)
  }
}

function rowSubtotal(row: BudgetItem) {
  return row.quantity * row.price
}

const sectionTotal = computed(() =>
  props.items.reduce((sum, r) => sum + r.quantity * r.price, 0),
)
const effectiveSectionTotal = computed(() => props.manualTotal ?? sectionTotal.value)
const hasManualTotal = computed(() => props.manualTotal !== null)

const inputRefs = ref<HTMLInputElement[]>([])

const dropdownStyle = computed(() => {
  if (props.activeSectionIndex !== props.sectionIndex || props.activeRowIndex < 0) return {}
  const input = inputRefs.value[props.activeRowIndex]
  if (!input) return {}
  const rect = input.getBoundingClientRect()
  return {
    top: `${rect.bottom + window.scrollY + 4}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
  }
})
</script>

<template>
  <div class="mb-6">
    <!-- Encabezado de sección -->
    <div class="flex items-center gap-3 mb-3 no-print">
      <input
        :value="title"
        class="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-brand-500 focus:outline-none w-full max-w-xs"
        @input="emit('updateTitle', sectionIndex, ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="canRemove"
        class="text-xs text-zinc-400 hover:text-red-500 transition-colors shrink-0 flex items-center gap-1"
        title="Eliminar sección"
        @click="emit('removeSection', sectionIndex)"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        Eliminar sección
      </button>
    </div>
    <!-- Título solo impresión -->
    <h2 class="hidden print:block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">{{ title }}</h2>

    <div class="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 print-breakable">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-zinc-900 dark:bg-zinc-950 text-zinc-100">
            <th class="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide">Descripción</th>
            <th class="text-center py-3 px-2 font-semibold text-xs uppercase tracking-wide w-16">Unidad</th>
            <th class="text-center py-3 px-2 font-semibold text-xs uppercase tracking-wide w-20">Cant.</th>
            <th class="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wide w-28">P. Unitario</th>
            <th class="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wide w-28">Subtotal</th>
            <th class="w-10 no-print"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in items"
            :key="i"
            class="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <!-- Producto con autocompletado -->
            <td class="py-2 px-3">
              <input
                :ref="(el) => { if (el) inputRefs[i] = el as HTMLInputElement }"
                :value="row.productName"
                class="no-print w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Buscar producto..."
                @input="currentQuery = ($event.target as HTMLInputElement).value; emit('search', currentQuery, sectionIndex, i); emit('updateItem', sectionIndex, i, 'productName', currentQuery)"
                @blur="currentQuery = ''; emit('closeSearch')"
              />
              <span class="hidden print:inline text-zinc-800">{{ row.productName }}</span>
            </td>

            <!-- Unidad -->
            <td class="py-2 px-2 text-center">
              <select
                :value="row.unit"
                class="no-print w-full rounded-md border border-zinc-200 bg-white px-1 py-1.5 text-center text-sm focus:border-brand-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                @change="emit('updateItem', sectionIndex, i, 'unit', ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
              </select>
              <span class="hidden print:inline text-zinc-700">{{ row.unit }}</span>
            </td>

            <!-- Cantidad -->
            <td class="py-2 px-2 text-center">
              <input
                :value="row.quantity"
                type="number"
                min="0"
                step="0.01"
                class="no-print w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-center text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                @input="emit('updateItem', sectionIndex, i, 'quantity', +($event.target as HTMLInputElement).value)"
              />
              <span class="hidden print:inline text-zinc-700">{{ row.quantity }}</span>
            </td>

            <!-- Precio unitario -->
            <td class="py-2 px-3 text-right">
              <input
                :value="row.price"
                type="number"
                min="0"
                class="no-print w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-right text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                @input="emit('updateItem', sectionIndex, i, 'price', +($event.target as HTMLInputElement).value)"
              />
              <span class="hidden print:inline text-zinc-700">{{ clp(row.price) }}</span>
            </td>

            <!-- Subtotal -->
            <td class="py-2 px-4 text-right font-semibold text-zinc-800 dark:text-zinc-200">
              {{ clp(rowSubtotal(row)) }}
            </td>

            <!-- Eliminar fila -->
            <td class="py-2 px-1 no-print text-center">
              <button
                class="rounded-md p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Eliminar fila"
                @click="emit('removeRow', sectionIndex, i)"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-zinc-50 dark:bg-zinc-800/50 border-t-2 border-zinc-200 dark:border-zinc-700">
            <td colspan="4" class="py-3 px-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 text-right uppercase tracking-widest">
              Total {{ title }}
              <span v-if="hasManualTotal" class="no-print normal-case tracking-normal text-amber-600 dark:text-amber-400">
                manual
              </span>
            </td>
            <td class="py-3 px-4 text-right font-bold text-zinc-800 dark:text-zinc-200">
              <input
                :value="effectiveSectionTotal"
                type="number"
                min="0"
                step="0.01"
                class="no-print w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-right text-sm font-bold focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                title="Editar total de esta tabla"
                @input="emit('updateManualTotal', sectionIndex, ($event.target as HTMLInputElement).value === '' ? null : +($event.target as HTMLInputElement).value)"
              />
              <span class="hidden print:inline">{{ clp(effectiveSectionTotal) }}</span>
            </td>
            <td class="no-print" />
          </tr>
        </tfoot>
      </table>
    </div>

    <button
      class="no-print mt-3 text-sm text-brand-700 dark:text-brand-400 hover:text-brand-900 font-medium transition-colors"
      @click="emit('addRow', sectionIndex)"
    >
      + Agregar fila
    </button>

    <!-- Dropdown autocompletado fuera del overflow-hidden -->
    <Teleport to="body">
      <div
        v-if="activeSectionIndex === sectionIndex && activeRowIndex >= 0 && currentQuery.length > 0"
        class="fixed z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl overflow-hidden no-print"
        :style="dropdownStyle"
      >
        <!-- Resultados -->
        <ul v-if="searchResults.length" class="max-h-44 overflow-y-auto">
          <li
            v-for="p in searchResults"
            :key="p.id"
            class="px-3 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-900/20 cursor-pointer flex justify-between items-center transition-colors"
            @mousedown="emit('pick', p, sectionIndex, activeRowIndex)"
          >
            <span class="text-zinc-800 dark:text-zinc-200 font-medium text-sm">{{ p.name }}</span>
            <span class="text-zinc-400 text-xs">{{ p.unit }} &middot; {{ clp(Number(p.price)) }}</span>
          </li>
        </ul>

        <!-- Sin resultados -->
        <div v-else class="px-3 py-2.5 text-xs text-zinc-400 dark:text-zinc-500">
          Sin resultados para "{{ currentQuery }}"
        </div>

        <!-- Footer: crear nuevo -->
        <div class="border-t border-zinc-100 dark:border-zinc-800">
          <button
            class="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
            @mousedown.prevent="openAddModal"
          >
            <Plus class="h-3.5 w-3.5 shrink-0" />
            Crear "{{ currentQuery }}" como nuevo producto
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Modal de creación rápida -->
    <ProductQuickAddModal
      :open="modalOpen"
      :initial-name="modalInitialName"
      @close="modalOpen = false"
      @created="handleProductCreated"
    />
  </div>
</template>
