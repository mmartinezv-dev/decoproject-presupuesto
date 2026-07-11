import { http } from '../../../core/api/http-client'
import type { Budget } from '../../../types'

export interface BudgetListItem {
  id: number
  correlativo: number | null
  createdAt: string
  clientName: string
  total: number
  status: string
  currentStep: number
}

export const budgetsApi = {
  list: () => http.get<BudgetListItem[]>('/budgets'),
  getById: (id: number) => http.get<Budget>(`/budgets/${id}`),
  create: (data: unknown) => http.post<Budget>('/budgets', data),
  update: (id: number, data: unknown) => http.put<Budget>(`/budgets/${id}`, data),
  remove: (id: number) => http.del<void>(`/budgets/${id}`),
}
