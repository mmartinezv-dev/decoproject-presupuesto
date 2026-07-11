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

    <!-- Datos bancarios -->
    <div class="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
      <p class="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-1.5">Datos de Transferencia</p>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-zinc-700 dark:text-zinc-300">
        <span class="text-zinc-500 dark:text-zinc-400">Banco</span>
        <span class="font-medium">Santander</span>
        <span class="text-zinc-500 dark:text-zinc-400">Cuenta Corriente</span>
        <span class="font-medium">7309099-7</span>
        <span class="text-zinc-500 dark:text-zinc-400">Titular</span>
        <span class="font-medium">DecoProject</span>
        <span class="text-zinc-500 dark:text-zinc-400">RUT</span>
        <span class="font-medium">76.865.966-4</span>
        <span class="text-zinc-500 dark:text-zinc-400">Email</span>
        <span class="font-medium">decoproject26@gmail.com</span>
      </div>
    </div>
  </div>
</template>
