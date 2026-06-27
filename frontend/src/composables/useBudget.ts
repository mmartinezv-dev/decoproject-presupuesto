import { ref, reactive, computed } from 'vue'
import { api } from './useApi'
import type { BudgetItem, BudgetSection, CompanyInfo, Budget } from '../types'

const DEFAULT_NOTES = `Validez de la oferta: 15 días.
Tiempo estimado de ejecución: a convenir.
Forma de pago: 50% anticipo, 50% contra entrega.`

function createEmptyRow(): BudgetItem {
  return { productName: '', unit: 'un', quantity: 1, price: 0 }
}

export function useBudget() {
  const company = reactive<CompanyInfo>({
    name: 'DecoProject',
    rut: '77.311.416-1',
    address: 'Pasaje Bogatell 4 Sur #1145',
    phone: '+56965096721',
  })

  const client = reactive({ id: 0, name: '', rut: '', address: '', phone: '' })
  const logo = ref('')
  const notes = ref(DEFAULT_NOTES)
  const sections = ref<BudgetSection[]>([{ title: 'Productos', items: [createEmptyRow()] }])
  const images = ref<{ src: string; caption: string }[]>([])
  const visitFindings = ref<{ text: string; images: { src: string; caption: string }[] }[]>([{ text: '', images: [] }])
  const visitSummary = ref('')
  const preliminaryWorks = ref<string[]>([''])
  const saving = ref(false)

  const today = new Date().toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const neto = computed(() =>
    sections.value.reduce(
      (sum, s) => sum + s.items.reduce((s2, r) => s2 + r.quantity * r.price, 0),
      0,
    ),
  )
  const iva = computed(() => Math.round(neto.value * 0.19))
  const total = computed(() => neto.value + iva.value)

  function itemSubtotal(row: BudgetItem) {
    return row.quantity * row.price
  }

  // --- Row management ---
  function addRow(sectionIndex: number) {
    sections.value[sectionIndex].items.push(createEmptyRow())
  }

  function removeRow(sectionIndex: number, rowIndex: number) {
    sections.value[sectionIndex].items.splice(rowIndex, 1)
  }

  // --- Section management ---
  function addSection() {
    sections.value.push({ title: 'Nueva sección', items: [createEmptyRow()] })
  }

  function removeSection(sectionIndex: number) {
    sections.value.splice(sectionIndex, 1)
  }

  function updateSectionTitle(sectionIndex: number, title: string) {
    sections.value[sectionIndex].title = title
  }

  // --- Inspection ---
  function addFinding() { visitFindings.value.push({ text: '', images: [] }) }
  function removeFinding(i: number) { visitFindings.value.splice(i, 1) }
  function updateFinding(i: number, v: string) { visitFindings.value[i].text = v }

  function addFindingImages(findingIndex: number, e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files) return
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.onload = () => {
        visitFindings.value[findingIndex].images.push({ src: reader.result as string, caption: '' })
      }
      reader.readAsDataURL(file)
    }
    ;(e.target as HTMLInputElement).value = ''
  }

  function removeFindingImage(findingIndex: number, imageIndex: number) {
    visitFindings.value[findingIndex].images.splice(imageIndex, 1)
  }

  function updateFindingImageCaption(findingIndex: number, imageIndex: number, caption: string) {
    visitFindings.value[findingIndex].images[imageIndex].caption = caption
  }

  function addWork() { preliminaryWorks.value.push('') }
  function removeWork(i: number) { preliminaryWorks.value.splice(i, 1) }
  function updateWork(i: number, v: string) { preliminaryWorks.value[i] = v }

  // --- Evidence images ---
  function addImages(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files) return
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.onload = () => { images.value.push({ src: reader.result as string, caption: '' }) }
      reader.readAsDataURL(file)
    }
  }

  function removeImage(index: number) {
    images.value.splice(index, 1)
  }

  function updateImageCaption(index: number, caption: string) {
    images.value[index].caption = caption
  }

  // --- Logo ---
  function handleLogoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      logo.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  // --- Persistence ---
  async function loadBudget(id: string) {
    const b = await api.get<Budget>(`/budgets/${id}`)
    if (!b) return
    company.name = b.companyName
    company.rut = b.companyRut
    company.address = b.companyAddress
    company.phone = b.companyPhone
    Object.assign(client, {
      id: b.clientId,
      name: b.clientName,
      rut: b.clientRut,
      address: b.clientAddress,
      phone: b.clientPhone,
    })
    notes.value = b.notes
    visitFindings.value = b.visitFindings?.length ? b.visitFindings : [{ text: '', images: [] }]
    visitSummary.value = b.visitSummary || ''
    preliminaryWorks.value = b.preliminaryWorks?.length ? b.preliminaryWorks : ['']
    logo.value = b.logo || ''
    images.value = b.images || []

    // Reconstruct sections grouping items by section field (preserving order)
    const sectionMap = new Map<string, BudgetItem[]>()
    for (const item of b.items || []) {
      const title = item.section || 'Productos'
      if (!sectionMap.has(title)) sectionMap.set(title, [])
      sectionMap.get(title)!.push({
        productName: item.productName,
        unit: item.unit,
        quantity: Number(item.quantity),
        price: Number(item.price),
        section: title,
      })
    }
    if (sectionMap.size === 0) {
      sections.value = [{ title: 'Productos', items: [createEmptyRow()] }]
    } else {
      sections.value = [...sectionMap.entries()].map(([title, items]) => ({ title, items }))
    }
  }

  async function saveBudget(existingId?: string): Promise<boolean> {
    saving.value = true
    const payload = {
      companyName: company.name,
      companyRut: company.rut,
      companyAddress: company.address,
      companyPhone: company.phone,
      clientId: client.id || null,
      clientName: client.name,
      clientRut: client.rut,
      clientAddress: client.address,
      clientPhone: client.phone,
      notes: notes.value,
      visitFindings: visitFindings.value.filter((f) => f.text || f.images.length),
      visitSummary: visitSummary.value,
      preliminaryWorks: preliminaryWorks.value.filter(Boolean),
      logo: logo.value,
      images: images.value,
      neto: neto.value,
      iva: iva.value,
      total: total.value,
      items: sections.value.flatMap((s) =>
        s.items
          .filter((i) => i.productName)
          .map((i) => ({
            productName: i.productName,
            unit: i.unit,
            quantity: i.quantity,
            price: i.price,
            subtotal: itemSubtotal(i),
            section: s.title,
          })),
      ),
    }
    try {
      if (existingId) {
        await api.put(`/budgets/${existingId}`, payload)
      } else {
        await api.post('/budgets', payload)
      }
      return true
    } catch (err) {
      console.error('Error al guardar presupuesto:', err)
      alert('Error al guardar el presupuesto. Intentá de nuevo.')
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    company,
    client,
    logo,
    notes,
    sections,
    images,
    saving,
    today,
    neto,
    iva,
    total,
    addRow,
    removeRow,
    addSection,
    removeSection,
    updateSectionTitle,
    visitFindings,
    visitSummary,
    preliminaryWorks,
    addFinding, removeFinding, updateFinding,
    addFindingImages, removeFindingImage, updateFindingImageCaption,
    addWork, removeWork, updateWork,
    addImages,
    removeImage,
    updateImageCaption,
    handleLogoChange,
    loadBudget,
    saveBudget,
  }
}
