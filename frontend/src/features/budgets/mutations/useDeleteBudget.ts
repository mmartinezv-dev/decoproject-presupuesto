import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { budgetsApi } from '../api/budgets.api'
import { budgetKeys } from '../queries/useBudgetsList'

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => budgetsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
    },
  })
}
