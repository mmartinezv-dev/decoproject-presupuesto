<script setup lang="ts">
import { onMounted } from 'vue'
import { useCrud } from '../composables/useCrud'
import type { Client } from '../types'

const { items, form, editing, load, save, edit, remove, reset } = useCrud<Client>(
  '/clients',
  () => ({ name: '', rut: '', address: '', phone: '' }),
)

onMounted(load)
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Clientes</h1>

  <form class="bg-white rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-end" @submit.prevent="save">
    <div>
      <label class="block text-sm font-medium text-gray-600">Nombre / Razón Social</label>
      <input v-model="form.name" required class="w-full border rounded px-2 py-1" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600">RUT</label>
      <input v-model="form.rut" class="w-full border rounded px-2 py-1" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600">Dirección</label>
      <input v-model="form.address" class="w-full border rounded px-2 py-1" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600">Teléfono</label>
      <input v-model="form.phone" class="w-full border rounded px-2 py-1" />
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
        <th class="text-left p-2">RUT</th>
        <th class="text-left p-2">Dirección</th>
        <th class="text-left p-2">Teléfono</th>
        <th class="p-2 w-24"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="c in items" :key="c.id" class="border-t hover:bg-gray-50">
        <td class="p-2">{{ c.name }}</td>
        <td class="p-2">{{ c.rut }}</td>
        <td class="p-2">{{ c.address }}</td>
        <td class="p-2">{{ c.phone }}</td>
        <td class="p-2 flex gap-1 justify-center">
          <button class="text-blue-600 hover:underline text-xs" @click="edit(c)">Editar</button>
          <button class="text-red-600 hover:underline text-xs" @click="remove(c.id!)">Eliminar</button>
        </td>
      </tr>
      <tr v-if="!items.length">
        <td colspan="5" class="p-4 text-center text-gray-400">Sin clientes registrados</td>
      </tr>
    </tbody>
  </table>
</template>
