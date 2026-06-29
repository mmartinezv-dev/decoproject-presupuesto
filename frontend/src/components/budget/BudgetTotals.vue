<script setup lang="ts">
import { useFormat } from '../../composables/useFormat'

defineProps<{
  neto: number
  iva: number
  total: number
}>()

const { clp } = useFormat()
</script>

<template>
  <div class="print-section flex justify-end mb-6">
    <div class="w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
      <div class="flex justify-between items-center py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
        <span>Valor Neto</span>
        <span class="font-medium text-zinc-800 dark:text-zinc-200">{{ clp(neto) }}</span>
      </div>
      <div class="flex justify-between items-center py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
        <span>IVA (19%)</span>
        <span class="font-medium text-zinc-800 dark:text-zinc-200">{{ clp(iva) }}</span>
      </div>
      <div class="flex justify-between items-center py-3.5 px-4 bg-zinc-900 dark:bg-zinc-950 text-white">
        <span class="font-semibold text-sm uppercase tracking-wide">Total</span>
        <span class="font-extrabold text-lg text-brand-300">{{ clp(total) }}</span>
      </div>
    </div>
  </div>
</template>
