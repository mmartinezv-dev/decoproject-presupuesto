<script setup lang="ts">
defineProps<{
  saving: boolean
}>()

defineEmits<{
  save: []
  print: []
}>()
</script>

<template>
  <div class="no-print flex gap-3 justify-end">
    <button
      :disabled="saving"
      class="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
      @click="$emit('save')"
    >
      {{ saving ? 'Guardando...' : 'Guardar Presupuesto' }}
    </button>
    <button
      class="px-6 py-2.5 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
      @click="$emit('print')"
    >
      Imprimir / Exportar PDF
    </button>
  </div>
</template>
