<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCrud } from '../composables/useCrud'
import { api } from '../composables/useApi'
import type { Product, Category } from '../types'

const { items, form, editing, load, save, edit, remove, reset } = useCrud<Product>(
  '/products',
  () => ({ name: '', description: '', unit: 'un', price: 0, categoryId: undefined }),
)

const categories = ref<Category[]>([])

onMounted(async () => {
  categories.value = await api.get('/categories')
  await load()
})
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Productos / Insumos</h1>

  <form class="bg-white rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3 items-end" @submit.prevent="save">
    <div>
      <label class="block text-sm font-medium text-gray-600">Nombre</label>
      <input v-model="form.name" required class="w-full border rounded px-2 py-1" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600">Categoría</label>
      <select v-model.number="form.categoryId" class="w-full border rounded px-2 py-1">
        <option :value="undefined">-- Sin categoría --</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600">Unidad</label>
      <select v-model="form.unit" class="w-full border rounded px-2 py-1">
        <option value="un">un</option>
        <option value="mt2">mt2</option>
        <option value="mt">mt</option>
        <option value="ml">ml</option>
        <option value="kg">kg</option>
        <option value="gl">global</option>
        <option value="lt">lt</option>
        <option value="m3">m3</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600">Precio Unitario</label>
      <input v-model.number="form.price" type="number" min="0" class="w-full border rounded px-2 py-1" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600">Descripción</label>
      <input v-model="form.description" class="w-full border rounded px-2 py-1" />
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
        <th class="text-left p-2">Categoría</th>
        <th class="text-left p-2">Unidad</th>
        <th class="text-right p-2">Precio</th>
        <th class="p-2 w-24"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in items" :key="p.id" class="border-t hover:bg-gray-50">
        <td class="p-2">{{ p.name }}</td>
        <td class="p-2 text-gray-500">{{ p.category?.name || '—' }}</td>
        <td class="p-2">{{ p.unit }}</td>
        <td class="p-2 text-right">{{ Number(p.price).toLocaleString('es-CL') }}</td>
        <td class="p-2 flex gap-1 justify-center">
          <button class="text-blue-600 hover:underline text-xs" @click="edit(p)">Editar</button>
          <button class="text-red-600 hover:underline text-xs" @click="remove(p.id!)">Eliminar</button>
        </td>
      </tr>
      <tr v-if="!items.length">
        <td colspan="5" class="p-4 text-center text-gray-400">Sin productos registrados</td>
      </tr>
    </tbody>
  </table>
</template>
