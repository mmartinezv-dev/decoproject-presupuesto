<script setup lang="ts">
import { ref } from 'vue'
import { useBudgetsList } from '../features/budgets/queries/useBudgetsList'
import { useDeleteBudget } from '../features/budgets/mutations/useDeleteBudget'
import { useFormat } from '../composables/useFormat'
import BudgetListSkeleton from '../features/budgets/components/BudgetListSkeleton.vue'

const { clp } = useFormat()

const { data: budgets, isLoading, isError, error } = useBudgetsList()

const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget()
const deletingId = ref<number | null>(null)

function handleDelete(id: number) {
  if (!confirm('¿Eliminar este presupuesto?')) return
  deletingId.value = id
  deleteBudget(id, {
    onSettled: () => { deletingId.value = null },
  })
}
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Presupuestos Guardados</h1>

  <!-- Cargando -->
  <BudgetListSkeleton v-if="isLoading" :rows="6" />

  <!-- Error -->
  <div
    v-else-if="isError"
    class="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
  >
    Error al cargar presupuestos: {{ (error as Error)?.message }}
  </div>

  <!-- Datos -->
  <table v-else class="w-full bg-white rounded shadow text-sm">
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
      <tr
        v-for="b in budgets"
        :key="b.id"
        class="border-t hover:bg-gray-50"
      >
        <td class="p-2">{{ b.id }}</td>
        <td class="p-2">{{ new Date(b.createdAt).toLocaleDateString('es-CL') }}</td>
        <td class="p-2">{{ b.clientName || 'Sin cliente' }}</td>
        <td class="p-2 text-right font-medium">{{ clp(b.total) }}</td>
        <td class="p-2 flex gap-2 justify-center">
          <router-link
            :to="`/presupuestos/${b.id}`"
            class="text-blue-600 hover:underline text-xs"
          >
            Ver/Editar
          </router-link>
          <button
            class="text-red-600 hover:underline text-xs disabled:opacity-40"
            :disabled="isDeleting && deletingId === b.id"
            @click="handleDelete(b.id)"
          >
            {{ isDeleting && deletingId === b.id ? '...' : 'Eliminar' }}
          </button>
        </td>
      </tr>
      <tr v-if="!budgets?.length">
        <td colspan="5" class="p-4 text-center text-gray-400">
          Sin presupuestos guardados
        </td>
      </tr>
    </tbody>
  </table>
</template>
