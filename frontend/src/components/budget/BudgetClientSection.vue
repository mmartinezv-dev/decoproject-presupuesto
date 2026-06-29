<script setup lang="ts">
import type { Client } from '../../types'

defineProps<{
  client: { id: number; name: string; rut: string; address: string; phone: string }
  clients: Client[]
}>()

defineEmits<{
  selectClient: [client: Client]
  'update:field': [field: string, value: string]
}>()
</script>

<template>
  <div class="print-section mb-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5">
    <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Datos del Cliente</h2>

    <!-- Editable -->
    <div class="no-print grid grid-cols-1 md:grid-cols-4 gap-3">
      <div>
        <label class="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Seleccionar</label>
        <select
          class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          @change="(e: Event) => {
            const id = +(e.target as HTMLSelectElement).value
            const c = clients.find(c => c.id === id)
            if (c) $emit('selectClient', c)
          }"
        >
          <option value="">-- Cliente --</option>
          <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Nombre / Razón Social</label>
        <input
          :value="client.name"
          class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="Nombre"
          @input="$emit('update:field', 'name', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">RUT</label>
        <input
          :value="client.rut"
          class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="RUT"
          @input="$emit('update:field', 'rut', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Dirección</label>
        <input
          :value="client.address"
          class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="Dirección"
          @input="$emit('update:field', 'address', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Print -->
    <div class="hidden print:grid print:grid-cols-2 print:gap-x-8 text-sm text-zinc-700">
      <p><span class="font-semibold text-zinc-800">Cliente:</span> {{ client.name }}</p>
      <p v-if="client.rut"><span class="font-semibold text-zinc-800">RUT:</span> {{ client.rut }}</p>
      <p v-if="client.address"><span class="font-semibold text-zinc-800">Dirección:</span> {{ client.address }}</p>
      <p v-if="client.phone"><span class="font-semibold text-zinc-800">Teléfono:</span> {{ client.phone }}</p>
    </div>
  </div>
</template>
