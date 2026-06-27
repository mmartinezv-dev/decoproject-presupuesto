import { type Ref, ref } from 'vue'
import { api } from './useApi'

export function useCrud<T extends { id?: number }>(endpoint: string, createEmpty: () => T) {
  const items: Ref<T[]> = ref([])
  const form: Ref<T> = ref(createEmpty()) as Ref<T>
  const editing = ref(false)

  async function load() {
    try {
      items.value = await api.get<T[]>(endpoint)
    } catch (err) {
      console.error(`Error al cargar ${endpoint}:`, err)
    }
  }

  async function save() {
    try {
      if (editing.value && form.value.id) {
        await api.put(`${endpoint}/${form.value.id}`, form.value)
      } else {
        await api.post(endpoint, form.value)
      }
      reset()
      await load()
    } catch (err) {
      console.error(`Error al guardar en ${endpoint}:`, err)
      alert('Error al guardar. Intentá de nuevo.')
    }
  }

  function edit(item: T) {
    form.value = { ...item }
    editing.value = true
  }

  async function remove(id: number) {
    if (!confirm('¿Eliminar este registro?')) return
    try {
      await api.del(`${endpoint}/${id}`)
      await load()
    } catch (err) {
      console.error(`Error al eliminar en ${endpoint}:`, err)
      alert('Error al eliminar. Intentá de nuevo.')
    }
  }

  function reset() {
    form.value = createEmpty()
    editing.value = false
  }

  return { items, form, editing, load, save, edit, remove, reset }
}
