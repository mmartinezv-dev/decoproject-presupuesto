import { useQuery } from '@tanstack/vue-query'
import { budgetsApi } from '../api/budgets.api'

export const budgetKeys = {
  all:    () => ['budgets'] as const,
  lists:  () => ['budgets', 'list'] as const,
  detail: (id: number) => ['budgets', id] as const,
}

export function useBudgetsList() {
  return useQuery({
    queryKey: budgetKeys.lists(),
    queryFn:  budgetsApi.list,
  })
}
