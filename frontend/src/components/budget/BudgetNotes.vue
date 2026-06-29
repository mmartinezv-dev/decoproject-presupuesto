<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="print-section mb-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
    <h3 class="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Condiciones Comerciales</h3>
    <textarea
      :value="modelValue"
      rows="4"
      class="no-print w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      placeholder="Condiciones de pago, garantías, plazos..."
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
    <p class="hidden print:block text-sm text-zinc-600 whitespace-pre-line leading-relaxed">{{ modelValue }}</p>
  </div>
</template>
