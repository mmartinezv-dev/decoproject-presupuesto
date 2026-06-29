<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { Plus, Pencil, Trash2, Package } from '@lucide/vue'
import { useCrud } from '../composables/useCrud'
import { api } from '../composables/useApi'
import FormField from '../shared/ui/FormField.vue'
import SkeletonLoader from '../shared/ui/SkeletonLoader.vue'
import type { Product, Category } from '../types'

const { items, form, editing, load, save, edit, remove, reset } = useCrud<Product>(
  '/products',
  () => ({ name: '', description: '', unit: 'un', price: 0, categoryId: undefined }),
)

const categories   = ref<Category[]>([])
const loading      = ref(true)
const confirmingId = ref<number | null>(null)

onMounted(async () => {
  categories.value = await api.get('/categories')
  await load()
  loading.value = false
})

async function handleRemove(id: number) {
  confirmingId.value = null
  await remove(id)
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 p-6">
    <div>
      <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Productos / Insumos</h1>
      <p class="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Catálogo de materiales y servicios</p>
    </div>

    <!-- Form -->
    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {{ editing ? 'Editar producto' : 'Nuevo producto' }}
      </h2>
      <form class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6" @submit.prevent="save">
        <div class="lg:col-span-2">
          <FormField label="Nombre" required>
            <input v-model="form.name" required placeholder="Ej: Pintura látex premium" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500" />
          </FormField>
        </div>
        <FormField label="Categoría">
          <select v-model.number="form.categoryId" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
            <option :value="undefined">Sin categoría</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </FormField>
        <FormField label="Unidad">
          <select v-model="form.unit" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
            <option value="un">un</option>
            <option value="mt2">mt²</option>
            <option value="mt">mt</option>
            <option value="ml">ml</option>
            <option value="kg">kg</option>
            <option value="gl">global</option>
            <option value="lt">lt</option>
            <option value="m3">m³</option>
          </select>
        </FormField>
        <FormField label="Precio Unitario">
          <input v-model.number="form.price" type="number" min="0" placeholder="0" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500" />
        </FormField>
        <FormField label="Descripción">
          <input v-model="form.description" placeholder="Opcional" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500" />
        </FormField>
        <div class="flex items-end gap-2 sm:col-span-2 lg:col-span-6">
          <button type="submit" class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700">
            <Plus v-if="!editing" class="h-4 w-4" />
            {{ editing ? 'Actualizar' : 'Agregar' }}
          </button>
          <button v-if="editing" type="button" class="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800" @click="reset">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div v-if="loading" class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <div v-for="i in 5" :key="i" class="flex items-center gap-6 px-4 py-3.5">
          <SkeletonLoader height="h-4" width="w-48" />
          <SkeletonLoader height="h-5" width="w-20" />
          <SkeletonLoader height="h-4" width="w-10" />
          <SkeletonLoader height="h-4" width="w-20" class="ml-auto" />
        </div>
      </div>
      <div v-else-if="!items.length" class="flex flex-col items-center justify-center gap-2 py-12">
        <Package class="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
        <p class="text-sm text-zinc-400 dark:text-zinc-500">Sin productos registrados</p>
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Nombre</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 hidden md:table-cell">Categoría</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Unidad</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Precio</th>
            <th class="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr v-for="p in items" :key="p.id" class="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30">
            <td class="px-4 py-3.5">
              <p class="font-medium text-zinc-800 dark:text-zinc-200">{{ p.name }}</p>
              <p v-if="p.description" class="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{{ p.description }}</p>
            </td>
            <td class="px-4 py-3.5 hidden md:table-cell">
              <span v-if="p.category?.name" class="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {{ p.category.name }}
              </span>
              <span v-else class="text-zinc-400 dark:text-zinc-600">—</span>
            </td>
            <td class="px-4 py-3.5 text-zinc-500 dark:text-zinc-400 font-mono text-xs">{{ p.unit }}</td>
            <td class="px-4 py-3.5 text-right font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
              {{ Number(p.price).toLocaleString('es-CL') }}
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center justify-end gap-1">
                <template v-if="confirmingId === p.id">
                  <span class="mr-1 text-xs text-zinc-500">¿Eliminar?</span>
                  <button class="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" @click="handleRemove(p.id!)">Sí</button>
                  <button class="rounded px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" @click="confirmingId = null">No</button>
                </template>
                <template v-else>
                  <button class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200" @click="edit(p)"><Pencil class="h-4 w-4" /></button>
                  <button class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400" @click="confirmingId = p.id!"><Trash2 class="h-4 w-4" /></button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
