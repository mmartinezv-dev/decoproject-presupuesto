<script setup lang="ts">
import type { CompanyInfo } from '../../types'

defineProps<{
  company: CompanyInfo
  logo: string
  date: string
  correlativo: number | null
}>()

defineEmits<{
  'update:company': [field: keyof CompanyInfo, value: string]
  'update:logo': [e: Event]
}>()
</script>

<template>
  <div class="print-section flex justify-between items-start pb-6 mb-6 border-b-2 border-brand-800">
    <div class="flex items-center gap-5">
      <!-- Logo -->
      <div class="shrink-0">
        <img v-if="logo" :src="logo" alt="Logo" class="h-20 w-auto object-contain" />
        <label
          v-else
          class="no-print flex items-center justify-center w-20 h-20 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl cursor-pointer text-zinc-400 text-xs text-center hover:border-brand-500 hover:text-brand-600 transition-colors"
        >
          Cargar Logo
          <input type="file" accept="image/*" class="hidden" @change="$emit('update:logo', $event)" />
        </label>
      </div>

      <!-- Datos empresa (editable) -->
      <div class="no-print space-y-1.5">
        <input
          :value="company.name"
          class="block font-bold text-xl text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-brand-500 focus:outline-none w-72 placeholder-zinc-400"
          placeholder="Nombre de la empresa"
          @input="$emit('update:company', 'name', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="company.rut"
          class="block text-sm text-zinc-500 dark:text-zinc-400 bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-brand-500 focus:outline-none placeholder-zinc-400"
          placeholder="RUT"
          @input="$emit('update:company', 'rut', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="company.address"
          class="block text-sm text-zinc-500 dark:text-zinc-400 bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-brand-500 focus:outline-none placeholder-zinc-400"
          placeholder="Dirección"
          @input="$emit('update:company', 'address', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="company.phone"
          class="block text-sm text-zinc-500 dark:text-zinc-400 bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-brand-500 focus:outline-none placeholder-zinc-400"
          placeholder="Teléfono"
          @input="$emit('update:company', 'phone', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Datos empresa (print) -->
      <div class="hidden print:block space-y-0.5">
        <p class="font-bold text-xl text-zinc-900 tracking-tight">{{ company.name }}</p>
        <p v-if="company.rut" class="text-sm text-zinc-600">RUT: {{ company.rut }}</p>
        <p v-if="company.address" class="text-sm text-zinc-600">{{ company.address }}</p>
        <p v-if="company.phone" class="text-sm text-zinc-600">Tel: {{ company.phone }}</p>
      </div>
    </div>

    <!-- Título + fecha + correlativo -->
    <div class="text-right">
      <h1 class="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        PRESUPUESTO<span v-if="correlativo"> #{{ correlativo }}</span>
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{{ date }}</p>
    </div>
  </div>
</template>
