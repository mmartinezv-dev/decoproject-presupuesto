<script setup lang="ts">
import { ref } from 'vue'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import { Plus, Pencil, Trash2, FileText } from '@lucide/vue'
import { useBudgetsList } from '../features/budgets/queries/useBudgetsList'
import { useDeleteBudget } from '../features/budgets/mutations/useDeleteBudget'
import { useFormat } from '../composables/useFormat'
import BudgetListSkeleton from '../features/budgets/components/BudgetListSkeleton.vue'

const { clp } = useFormat()

const { data: budgets, isLoading, isError, refetch } = useBudgetsList()
const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget()

const confirmingId = ref<number | null>(null)
const deletingId   = ref<number | null>(null)

function handleDelete(id: number) {
  deletingId.value = id
  deleteBudget(id, {
    onSuccess: () => toast.success('Presupuesto eliminado'),
    onError:   () => toast.error('Error al eliminar. Intentá de nuevo.'),
    onSettled: () => { deletingId.value = null; confirmingId.value = null },
  })
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Presupuestos</h1>
        <p class="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          {{ isLoading ? '—' : `${budgets?.length ?? 0} presupuestos guardados` }}
        </p>
      </div>
      <RouterLink
        to="/presupuestos/nuevo"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        <Plus class="h-4 w-4" />
        Nuevo
      </RouterLink>
    </div>

    <!-- Skeleton -->
    <BudgetListSkeleton v-if="isLoading" :rows="6" />

    <!-- Error -->
    <div
      v-else-if="isError"
      class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/20 dark:bg-red-500/10"
    >
      <div class="flex items-center justify-between gap-4">
        <p class="text-sm text-red-600 dark:text-red-400">
          Error al cargar presupuestos. Verificá tu conexión.
        </p>
        <button
          class="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          @click="refetch()"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <!-- Empty state -->
      <div v-if="!budgets?.length" class="flex flex-col items-center justify-center gap-3 py-16">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <FileText class="h-6 w-6 text-zinc-400" />
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sin presupuestos</p>
          <p class="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">Creá tu primer presupuesto para comenzar</p>
        </div>
        <RouterLink
          to="/presupuestos/nuevo"
          class="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
        >
          <Plus class="h-3.5 w-3.5" /> Crear presupuesto
        </RouterLink>
      </div>

      <!-- Data table -->
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 w-16">#</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Fecha</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Cliente</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Total</th>
            <th class="px-4 py-3 w-28"></th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr
            v-for="b in budgets"
            :key="b.id"
            class="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30"
          >
            <td class="px-4 py-3.5">
              <span class="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-mono font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                #{{ b.id }}
              </span>
            </td>
            <td class="px-4 py-3.5 text-zinc-600 dark:text-zinc-400">
              {{ new Date(b.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) }}
            </td>
            <td class="px-4 py-3.5 font-medium text-zinc-800 dark:text-zinc-200">
              <span v-if="b.clientName">{{ b.clientName }}</span>
              <span v-else class="font-normal text-zinc-400 dark:text-zinc-500">Sin cliente</span>
            </td>
            <td class="px-4 py-3.5 text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {{ clp(b.total) }}
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center justify-end gap-1">
                <!-- Delete confirmation inline -->
                <template v-if="confirmingId === b.id">
                  <span class="mr-1 text-xs text-zinc-500 dark:text-zinc-400">¿Eliminar?</span>
                  <button
                    class="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                    :disabled="isDeleting && deletingId === b.id"
                    @click="handleDelete(b.id)"
                  >
                    {{ isDeleting && deletingId === b.id ? '...' : 'Sí' }}
                  </button>
                  <button
                    class="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    @click="confirmingId = null"
                  >
                    No
                  </button>
                </template>

                <template v-else>
                  <RouterLink
                    :to="`/presupuestos/${b.id}`"
                    class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    title="Ver / Editar"
                  >
                    <Pencil class="h-4 w-4" />
                  </RouterLink>
                  <button
                    class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    title="Eliminar"
                    @click="confirmingId = b.id"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
