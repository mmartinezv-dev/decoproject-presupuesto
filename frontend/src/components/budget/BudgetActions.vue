<script setup lang="ts">
defineProps<{
  saving: boolean
}>()

defineEmits<{
  save: []
  print: []
  pdf: []
}>()
</script>

<template>
  <div class="no-print flex gap-3 justify-end mt-6">
    <button
      class="px-5 py-2.5 bg-zinc-800 dark:bg-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-900 dark:hover:bg-zinc-600 transition-colors shadow-sm text-sm"
      @click="$emit('print')"
    >
      Imprimir
    </button>
    <button
      class="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm"
      @click="$emit('pdf')"
    >
      Exportar PDF
    </button>
    <button
      :disabled="saving"
      class="px-5 py-2.5 bg-brand-800 text-white font-semibold rounded-lg hover:bg-brand-900 disabled:opacity-50 transition-colors shadow-sm text-sm"
      @click="$emit('save')"
    >
      {{ saving ? 'Guardando...' : 'Guardar Presupuesto' }}
    </button>
  </div>
</template>
