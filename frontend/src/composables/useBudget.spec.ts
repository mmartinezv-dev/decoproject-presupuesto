import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Budget } from '../types'

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('./useApi', () => ({ api: apiMock }))
vi.mock('vue-sonner', () => ({ toast: { error: vi.fn() } }))

import { useBudget } from './useBudget'

describe('useBudget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('persists duplicate and empty sections with a manual total', async () => {
    apiMock.post.mockResolvedValue({ id: 10 })
    const budget = useBudget()
    budget.sections.value = [
      {
        title: 'Repetida',
        manualTotal: null,
        items: [
          { productName: 'Producto', unit: 'un', quantity: 2, price: 100 },
        ],
      },
      {
        title: 'Repetida',
        manualTotal: 2500,
        items: [{ productName: '', unit: 'un', quantity: 1, price: 0 }],
      },
    ]

    await budget.saveDraft(5)

    expect(apiMock.post).toHaveBeenCalledWith(
      '/budgets',
      expect.objectContaining({
        neto: 2700,
        iva: 513,
        total: 3213,
        sections: [
          { title: 'Repetida', manualTotal: null },
          { title: 'Repetida', manualTotal: 2500 },
        ],
        items: [
          expect.objectContaining({
            productName: 'Producto',
            sectionIndex: 0,
          }),
        ],
      }),
    )
  })

  it('restores section boundaries and the original budget date', async () => {
    const savedBudget: Budget = {
      id: 12,
      createdAt: '2025-01-02T15:00:00.000Z',
      companyName: 'DecoProject',
      companyRut: '',
      companyAddress: '',
      companyPhone: '',
      clientId: null,
      clientName: '',
      clientRut: '',
      clientAddress: '',
      clientPhone: '',
      notes: '',
      logo: '',
      neto: 1700,
      iva: 323,
      total: 2023,
      sections: [
        { title: 'Repetida', manualTotal: null },
        { title: 'Repetida', manualTotal: 1000 },
        { title: 'Solo total', manualTotal: 500 },
      ],
      items: [
        {
          productName: 'Producto',
          unit: 'un',
          quantity: 2,
          price: 100,
          section: 'Repetida',
          sectionIndex: 0,
        },
      ],
    }
    apiMock.get.mockResolvedValue(savedBudget)
    const budget = useBudget()

    await budget.loadBudget('12')

    expect(budget.sections.value).toHaveLength(3)
    expect(budget.sections.value[0].items[0].productName).toBe('Producto')
    expect(budget.sections.value[1].manualTotal).toBe(1000)
    expect(budget.sections.value[1].items[0].productName).toBe('')
    expect(budget.sections.value[2].manualTotal).toBe(500)
    expect(budget.today.value).toContain('2025')
  })
})
