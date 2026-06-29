<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../composables/useApi'
import { useFormat } from '../composables/useFormat'
import type { Budget } from '../types'

const { clp } = useFormat()

const budgets = ref<Pick<Budget, 'id' | 'createdAt' | 'clientName' | 'total'>[]>([])

async function load() {
  try {
    budgets.value = await api.get('/budgets')
  } catch (err) {
    console.error('Error al cargar presupuestos:', err)
  }
}

async function remove(id: number) {
  if (!confirm('¿Eliminar este presupuesto?')) return
  try {
    await api.del(`/budgets/${id}`)
    await load()
  } catch (err) {
    console.error('Error al eliminar presupuesto:', err)
    alert('Error al eliminar. Intentá de nuevo.')
  }
}

onMounted(load)
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Presupuestos Guardados</h1>

  <table class="w-full bg-white rounded shadow text-sm">
    <thead class="bg-gray-100">
      <tr>
        <th class="text-left p-2">#</th>
        <th class="text-left p-2">Fecha</th>
        <th class="text-left p-2">Cliente</th>
        <th class="text-right p-2">Total</th>
        <th class="p-2 w-32"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="b in budgets" :key="b.id" class="border-t hover:bg-gray-50">
        <td class="p-2">{{ b.id }}</td>
        <td class="p-2">{{ new Date(b.createdAt!).toLocaleDateString('es-CL') }}</td>
        <td class="p-2">{{ b.clientName || 'Sin cliente' }}</td>
        <td class="p-2 text-right font-medium">{{ clp(b.total) }}</td>
        <td class="p-2 flex gap-2 justify-center">
          <router-link :to="`/presupuestos/${b.id}`" class="text-blue-600 hover:underline text-xs">Ver/Editar</router-link>
          <button class="text-red-600 hover:underline text-xs" @click="remove(b.id!)">Eliminar</button>
        </td>
      </tr>
      <tr v-if="!budgets.length">
        <td colspan="5" class="p-4 text-center text-gray-400">Sin presupuestos guardados</td>
      </tr>
    </tbody>
  </table>
</template>
