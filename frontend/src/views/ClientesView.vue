<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { Plus, Pencil, Trash2, Users } from '@lucide/vue'
import { useCrud } from '../composables/useCrud'
import FormField from '../shared/ui/FormField.vue'
import SkeletonLoader from '../shared/ui/SkeletonLoader.vue'
import type { Client } from '../types'

const { items, form, editing, load, save, edit, remove, reset } = useCrud<Client>(
  '/clients',
  () => ({ name: '', rut: '', address: '', phone: '' }),
)

const loading      = ref(true)
const confirmingId = ref<number | null>(null)

onMounted(async () => { await load(); loading.value = false })

async function handleRemove(id: number) {
  confirmingId.value = null
  await remove(id)
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 p-6">
    <div>
      <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Clientes</h1>
      <p class="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Catálogo de clientes y empresas</p>
    </div>

    <!-- Form -->
    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {{ editing ? 'Editar cliente' : 'Nuevo cliente' }}
      </h2>
      <form class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5" @submit.prevent="save">
        <div class="lg:col-span-2">
          <FormField label="Nombre / Razón Social" required>
            <input v-model="form.name" required placeholder="Ej: Juan Pérez" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500" />
          </FormField>
        </div>
        <FormField label="RUT">
          <input v-model="form.rut" placeholder="12.345.678-9" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500" />
        </FormField>
        <FormField label="Dirección">
          <input v-model="form.address" placeholder="Av. Ejemplo 123" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500" />
        </FormField>
        <FormField label="Teléfono">
          <input v-model="form.phone" placeholder="+56 9 1234 5678" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500" />
        </FormField>
        <div class="flex items-end gap-2 sm:col-span-2 lg:col-span-5">
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
          <SkeletonLoader height="h-4" width="w-36" />
          <SkeletonLoader height="h-4" width="w-24" />
          <SkeletonLoader height="h-4" width="w-40" />
          <SkeletonLoader height="h-4" width="w-28" class="ml-auto" />
        </div>
      </div>
      <div v-else-if="!items.length" class="flex flex-col items-center justify-center gap-2 py-12">
        <Users class="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
        <p class="text-sm text-zinc-400 dark:text-zinc-500">Sin clientes registrados</p>
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Nombre</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">RUT</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 hidden md:table-cell">Dirección</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 hidden lg:table-cell">Teléfono</th>
            <th class="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr v-for="c in items" :key="c.id" class="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30">
            <td class="px-4 py-3.5 font-medium text-zinc-800 dark:text-zinc-200">{{ c.name }}</td>
            <td class="px-4 py-3.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">{{ c.rut || '—' }}</td>
            <td class="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 hidden md:table-cell">{{ c.address || '—' }}</td>
            <td class="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 hidden lg:table-cell">{{ c.phone || '—' }}</td>
            <td class="px-4 py-3.5">
              <div class="flex items-center justify-end gap-1">
                <template v-if="confirmingId === c.id">
                  <span class="mr-1 text-xs text-zinc-500">¿Eliminar?</span>
                  <button class="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" @click="handleRemove(c.id!)">Sí</button>
                  <button class="rounded px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" @click="confirmingId = null">No</button>
                </template>
                <template v-else>
                  <button class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200" @click="edit(c)"><Pencil class="h-4 w-4" /></button>
                  <button class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400" @click="confirmingId = c.id!"><Trash2 class="h-4 w-4" /></button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
