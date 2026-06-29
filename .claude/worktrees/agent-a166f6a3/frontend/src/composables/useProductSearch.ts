import { ref } from 'vue'
import { api } from './useApi'
import type { Product, BudgetItem } from '../types'

export function useProductSearch() {
  const searchResults = ref<Product[]>([])
  const activeSectionIndex = ref(-1)
  const activeRowIndex = ref(-1)

  async function search(query: string, sectionIndex: number, rowIndex: number) {
    activeSectionIndex.value = sectionIndex
    activeRowIndex.value = rowIndex
    if (query.length < 1) {
      searchResults.value = []
      return
    }
    try {
      searchResults.value = await api.get(`/products?q=${encodeURIComponent(query)}`)
    } catch (err) {
      console.error('Error al buscar productos:', err)
      searchResults.value = []
    }
  }

  function pick(product: Product, row: BudgetItem) {
    row.productName = product.name
    row.unit = product.unit
    row.price = Number(product.price)
    close()
  }

  function close() {
    setTimeout(() => {
      searchResults.value = []
      activeSectionIndex.value = -1
      activeRowIndex.value = -1
    }, 200)
  }

  return { searchResults, activeSectionIndex, activeRowIndex, search, pick, close }
}
