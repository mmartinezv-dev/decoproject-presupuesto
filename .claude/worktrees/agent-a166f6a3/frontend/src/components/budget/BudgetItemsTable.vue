<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BudgetItem, Product } from '../../types'
import { useFormat } from '../../composables/useFormat'

const props = defineProps<{
  sectionIndex: number
  title: string
  items: BudgetItem[]
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
  removeSection: [sectionIndex: number]
}>()

const { clp } = useFormat()

const UNITS = ['un', 'mt2', 'mt', 'ml', 'kg', 'gl', 'lt', 'm3']

function rowSubtotal(row: BudgetItem) {
  return row.quantity * row.price
}

const sectionTotal = computed(() =>
  props.items.reduce((sum, r) => sum + r.quantity * r.price, 0),
)

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
    <div class="flex items-center gap-2 mb-3 no-print">
      <input
        :value="title"
        class="text-xs font-bold text-blue-700 uppercase tracking-widest bg-transparent border-b border-transparent hover:border-blue-400 focus:border-blue-500 focus:outline-none w-full max-w-xs"
        @input="emit('updateTitle', sectionIndex, ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="canRemove"
        class="text-slate-400 hover:text-red-500 transition-colors text-xs shrink-0"
        title="Eliminar sección"
        @click="emit('removeSection', sectionIndex)"
      >
        ✕ Eliminar sección
      </button>
    </div>
    <!-- Título solo impresión -->
    <h2 class="hidden print:block text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">{{ title }}</h2>

    <div class="rounded-lg overflow-hidden border border-slate-200/60 bg-white/60 backdrop-blur-sm print-breakable">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-800 text-white">
            <th class="text-left py-2.5 px-3 font-semibold">Descripción</th>
            <th class="text-center py-2.5 px-2 font-semibold w-16">Unidad</th>
            <th class="text-center py-2.5 px-2 font-semibold w-20">Cant.</th>
            <th class="text-right py-2.5 px-3 font-semibold w-28">P. Unitario</th>
            <th class="text-right py-2.5 px-3 font-semibold w-28">Subtotal</th>
            <th class="w-10 no-print"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in items"
            :key="i"
            class="border-b border-slate-200/60 hover:bg-blue-50/40 transition-colors"
          >
            <!-- Producto con autocompletado -->
            <td class="py-2 px-3">
              <input
                :ref="(el) => { if (el) inputRefs[i] = el as HTMLInputElement }"
                :value="row.productName"
                class="no-print w-full bg-transparent border border-slate-300 rounded px-2 py-1 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Buscar producto..."
                @input="emit('search', ($event.target as HTMLInputElement).value, sectionIndex, i); emit('updateItem', sectionIndex, i, 'productName', ($event.target as HTMLInputElement).value)"
                @blur="emit('closeSearch')"
              />
              <span class="hidden print:inline text-slate-800">{{ row.productName }}</span>
            </td>

            <!-- Unidad -->
            <td class="py-2 px-2 text-center">
              <select
                :value="row.unit"
                class="no-print w-full bg-transparent border border-slate-300 rounded px-1 py-1 text-center text-sm focus:border-blue-500 outline-none"
                @change="emit('updateItem', sectionIndex, i, 'unit', ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
              </select>
              <span class="hidden print:inline text-slate-700">{{ row.unit }}</span>
            </td>

            <!-- Cantidad -->
            <td class="py-2 px-2 text-center">
              <input
                :value="row.quantity"
                type="number"
                min="0"
                step="0.01"
                class="no-print w-full bg-transparent border border-slate-300 rounded px-2 py-1 text-center focus:border-blue-500 outline-none"
                @input="emit('updateItem', sectionIndex, i, 'quantity', +($event.target as HTMLInputElement).value)"
              />
              <span class="hidden print:inline text-slate-700">{{ row.quantity }}</span>
            </td>

            <!-- Precio unitario -->
            <td class="py-2 px-3 text-right">
              <input
                :value="row.price"
                type="number"
                min="0"
                class="no-print w-full bg-transparent border border-slate-300 rounded px-2 py-1 text-right focus:border-blue-500 outline-none"
                @input="emit('updateItem', sectionIndex, i, 'price', +($event.target as HTMLInputElement).value)"
              />
              <span class="hidden print:inline text-slate-700">{{ clp(row.price) }}</span>
            </td>

            <!-- Subtotal -->
            <td class="py-2 px-3 text-right font-semibold text-slate-800">
              {{ clp(rowSubtotal(row)) }}
            </td>

            <!-- Eliminar fila -->
            <td class="py-2 px-1 no-print text-center">
              <button
                class="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none"
                title="Eliminar fila"
                @click="emit('removeRow', sectionIndex, i)"
              >
                &times;
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-slate-50 border-t-2 border-slate-200">
            <td colspan="4" class="py-2.5 px-3 text-sm font-semibold text-slate-600 text-right uppercase tracking-widest">
              Subtotal {{ title }}
            </td>
            <td class="py-2.5 px-3 text-right font-bold text-slate-800">
              {{ clp(sectionTotal) }}
            </td>
            <td class="no-print" />
          </tr>
        </tfoot>
      </table>
    </div>

    <button
      class="no-print mt-3 text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
      @click="emit('addRow', sectionIndex)"
    >
      + Agregar fila
    </button>

    <!-- Dropdown autocompletado fuera del overflow-hidden -->
    <Teleport to="body">
      <ul
        v-if="activeSectionIndex === sectionIndex && activeRowIndex >= 0 && searchResults.length"
        class="fixed z-50 bg-white border border-slate-200 shadow-lg rounded-lg max-h-40 overflow-auto no-print"
        :style="dropdownStyle"
      >
        <li
          v-for="p in searchResults"
          :key="p.id"
          class="px-3 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
          @mousedown="emit('pick', p, sectionIndex, activeRowIndex)"
        >
          <span class="text-slate-800 font-medium">{{ p.name }}</span>
          <span class="text-slate-400 text-xs">{{ p.unit }} &middot; {{ clp(Number(p.price)) }}</span>
        </li>
      </ul>
    </Teleport>
  </div>
</template>
