<script setup lang="ts">
import { onMounted } from 'vue'
import { useCrud } from '../composables/useCrud'
import type { Category } from '../types'

const { items, form, editing, load, save, edit, remove, reset } = useCrud<Category>(
  '/categories',
  () => ({ name: '', sortOrder: 0 }),
)

onMounted(load)
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Categorías</h1>

  <form class="bg-white rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end" @submit.prevent="save">
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-600">Nombre</label>
      <input v-model="form.name" required class="w-full border rounded px-2 py-1" placeholder="Ej: Costos Indirectos" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600">Orden</label>
      <input v-model.number="form.sortOrder" type="number" min="0" class="w-full border rounded px-2 py-1" />
    </div>
    <div class="flex gap-2">
      <button type="submit" class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
        {{ editing ? 'Actualizar' : 'Agregar' }}
      </button>
      <button v-if="editing" type="button" class="bg-gray-300 px-4 py-1 rounded" @click="reset">Cancelar</button>
    </div>
  </form>

  <table class="w-full bg-white rounded shadow text-sm">
    <thead class="bg-gray-100">
      <tr>
        <th class="text-left p-2">Nombre</th>
        <th class="text-center p-2 w-24">Orden</th>
        <th class="p-2 w-24"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="c in items" :key="c.id" class="border-t hover:bg-gray-50">
        <td class="p-2">{{ c.name }}</td>
        <td class="p-2 text-center text-gray-500">{{ c.sortOrder }}</td>
        <td class="p-2 flex gap-1 justify-center">
          <button class="text-blue-600 hover:underline text-xs" @click="edit(c)">Editar</button>
          <button class="text-red-600 hover:underline text-xs" @click="remove(c.id!)">Eliminar</button>
        </td>
      </tr>
      <tr v-if="!items.length">
        <td colspan="3" class="p-4 text-center text-gray-400">Sin categorías registradas</td>
      </tr>
    </tbody>
  </table>
</template>
