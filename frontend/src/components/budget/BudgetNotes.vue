<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="print-section mb-6 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/60 p-4">
    <h3 class="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">Condiciones Comerciales</h3>
    <textarea
      :value="modelValue"
      rows="4"
      class="no-print w-full bg-transparent border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
    <p class="hidden print:block text-sm text-slate-600 whitespace-pre-line leading-relaxed">{{ modelValue }}</p>
  </div>
</template>
