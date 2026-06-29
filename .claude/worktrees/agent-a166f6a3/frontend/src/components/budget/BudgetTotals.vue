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
    <div class="w-72 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/60 overflow-hidden">
      <div class="flex justify-between items-center py-2 px-4 text-sm text-slate-600">
        <span>Valor Neto</span>
        <span class="font-medium text-slate-800">{{ clp(neto) }}</span>
      </div>
      <div class="flex justify-between items-center py-2 px-4 text-sm text-slate-600 border-t border-slate-200/60">
        <span>IVA (19%)</span>
        <span class="font-medium text-slate-800">{{ clp(iva) }}</span>
      </div>
      <div class="flex justify-between items-center py-3 px-4 bg-slate-800 text-white">
        <span class="font-bold text-sm uppercase tracking-wide">Total</span>
        <span class="font-extrabold text-lg text-blue-400">{{ clp(total) }}</span>
      </div>
    </div>
  </div>
</template>
