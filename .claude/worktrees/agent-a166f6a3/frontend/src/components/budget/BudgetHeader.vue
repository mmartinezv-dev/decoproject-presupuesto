<script setup lang="ts">
import type { CompanyInfo } from '../../types'

defineProps<{
  company: CompanyInfo
  logo: string
  date: string
}>()

defineEmits<{
  'update:company': [field: keyof CompanyInfo, value: string]
  'update:logo': [e: Event]
}>()
</script>

<template>
  <div class="print-section flex justify-between items-start pb-5 mb-6 border-b-2 border-blue-600">
    <div class="flex items-center gap-5">
      <!-- Logo -->
      <div class="shrink-0">
        <img v-if="logo" :src="logo" alt="Logo" class="h-20 w-auto object-contain" />
        <label
          v-else
          class="no-print flex items-center justify-center w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer text-slate-400 text-xs text-center hover:border-blue-500 transition-colors"
        >
          Cargar Logo
          <input type="file" accept="image/*" class="hidden" @change="$emit('update:logo', $event)" />
        </label>
      </div>

      <!-- Datos empresa (editable) -->
      <div class="no-print space-y-1">
        <input
          :value="company.name"
          class="block font-bold text-xl text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-72 placeholder-slate-400"
          placeholder="Nombre de la empresa"
          @input="$emit('update:company', 'name', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="company.rut"
          class="block text-sm text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none placeholder-slate-400"
          placeholder="RUT"
          @input="$emit('update:company', 'rut', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="company.address"
          class="block text-sm text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none placeholder-slate-400"
          placeholder="Dirección"
          @input="$emit('update:company', 'address', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="company.phone"
          class="block text-sm text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none placeholder-slate-400"
          placeholder="Teléfono"
          @input="$emit('update:company', 'phone', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Datos empresa (print) -->
      <div class="hidden print:block space-y-0.5">
        <p class="font-bold text-xl text-slate-800 tracking-tight">{{ company.name }}</p>
        <p v-if="company.rut" class="text-sm text-slate-600">RUT: {{ company.rut }}</p>
        <p v-if="company.address" class="text-sm text-slate-600">{{ company.address }}</p>
        <p v-if="company.phone" class="text-sm text-slate-600">Tel: {{ company.phone }}</p>
      </div>
    </div>

    <!-- Título + fecha -->
    <div class="text-right">
      <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">PRESUPUESTO</h1>
      <p class="text-sm text-slate-500 mt-1">{{ date }}</p>
    </div>
  </div>
</template>
