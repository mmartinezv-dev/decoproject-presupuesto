import { type Ref, ref } from 'vue'
import { toast } from 'vue-sonner'
import { api } from './useApi'

export function useCrud<T extends { id?: number }>(endpoint: string, createEmpty: () => T) {
  const items: Ref<T[]> = ref([])
  const form: Ref<T> = ref(createEmpty()) as Ref<T>
  const editing = ref(false)

  async function load() {
    try {
      items.value = await api.get<T[]>(endpoint)
    } catch {
      // Graceful degradation — lista vacía visible para el usuario
    }
  }

  async function save() {
    try {
      if (editing.value && form.value.id) {
        await api.put(`${endpoint}/${form.value.id}`, form.value)
        toast.success('Registro actualizado')
      } else {
        await api.post(endpoint, form.value)
        toast.success('Registro creado')
      }
      reset()
      await load()
    } catch {
      toast.error('Error al guardar. Intentá de nuevo.')
    }
  }

  function edit(item: T) {
    form.value = { ...item }
    editing.value = true
  }

  async function remove(id: number) {
    try {
      await api.del(`${endpoint}/${id}`)
      await load()
      toast.success('Registro eliminado')
    } catch {
      toast.error('Error al eliminar. Intentá de nuevo.')
    }
  }

  function reset() {
    form.value = createEmpty()
    editing.value = false
  }

  return { items, form, editing, load, save, edit, remove, reset }
}
