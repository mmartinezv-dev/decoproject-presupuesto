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
  <div class="print-section mb-6 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60">
    <h2 class="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">Datos del Cliente</h2>

    <!-- Editable -->
    <div class="no-print grid grid-cols-1 md:grid-cols-4 gap-3">
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1">Seleccionar</label>
        <select
          class="w-full border border-slate-300 rounded px-2 py-1.5 text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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
        <label class="block text-xs font-medium text-slate-500 mb-1">Nombre / Razón Social</label>
        <input
          :value="client.name"
          class="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          placeholder="Nombre"
          @input="$emit('update:field', 'name', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1">RUT</label>
        <input
          :value="client.rut"
          class="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          placeholder="RUT"
          @input="$emit('update:field', 'rut', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1">Dirección</label>
        <input
          :value="client.address"
          class="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          placeholder="Dirección"
          @input="$emit('update:field', 'address', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Print -->
    <div class="hidden print:grid print:grid-cols-2 print:gap-x-8 text-sm text-slate-700">
      <p><span class="font-semibold text-slate-800">Cliente:</span> {{ client.name }}</p>
      <p v-if="client.rut"><span class="font-semibold text-slate-800">RUT:</span> {{ client.rut }}</p>
      <p v-if="client.address"><span class="font-semibold text-slate-800">Dirección:</span> {{ client.address }}</p>
      <p v-if="client.phone"><span class="font-semibold text-slate-800">Teléfono:</span> {{ client.phone }}</p>
    </div>
  </div>
</template>
