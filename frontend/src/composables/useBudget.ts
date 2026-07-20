import { ref, reactive, computed } from 'vue'
import { toast } from 'vue-sonner'
import { api } from './useApi'
import type { BudgetItem, BudgetSection, CompanyInfo, Budget, SpecialAnnotation } from '../types'

const DEFAULT_NOTES = `Validez de la oferta: 15 días.
Tiempo estimado de ejecución: a convenir.
Forma de pago: 50% anticipo, 50% contra entrega.`

function createEmptyRow(): BudgetItem {
  return { productName: '', unit: 'un', quantity: 1, price: 0 }
}

function createEmptyAnnotation(): SpecialAnnotation {
  return { title: 'Anotación especial', text: '' }
}

function normalizeSpecialAnnotations(
  annotations: (string | SpecialAnnotation)[] | undefined,
): SpecialAnnotation[] {
  if (!annotations?.length) return [createEmptyAnnotation()]

  return annotations.map((annotation, index) => {
    if (typeof annotation === 'string') {
      return {
        title: `Anotación ${index + 1}`,
        text: annotation,
      }
    }

    return {
      title: annotation.title || `Anotación ${index + 1}`,
      text: annotation.text || '',
    }
  })
}

function getSaveErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error) || !error.message) return fallback

  try {
    const body = JSON.parse(error.message) as { message?: string | string[] }
    if (Array.isArray(body.message)) return body.message.join('\n')
    return body.message || fallback
  } catch {
    return error.message
  }
}

export function useBudget() {
  const company = reactive<CompanyInfo>({
    name: 'DecoProject',
    rut: '77.311.416-1',
    address: 'Pasaje Bogatell 4 Sur #1145',
    phone: '+56965096721',
  })

  const client = reactive({ id: 0, name: '', rut: '', address: '', phone: '' })
  const correlativo = ref<number | null>(null)
  const draftId = ref<number | null>(null)
  const status = ref<'borrador' | 'final'>('borrador')
  const logo = ref('/logo-presupuesto.jpeg')
  const notes = ref(DEFAULT_NOTES)
  const sections = ref<BudgetSection[]>([{ title: 'Productos', items: [createEmptyRow()] }])
  const images = ref<{ src: string; caption: string }[]>([])
  const visitFindings = ref<{ text: string; images: { src: string; caption: string }[] }[]>([{ text: '', images: [] }])
  const visitSummary = ref('')
  const preliminaryWorks = ref<string[]>([''])
  const specialAnnotations = ref<SpecialAnnotation[]>([createEmptyAnnotation()])
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

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function addFindingImages(findingIndex: number, e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files) return
    for (const file of Array.from(files)) {
      const src = await fileToBase64(file)
      visitFindings.value[findingIndex].images.push({ src, caption: '' })
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

  function addSpecialAnnotation() { specialAnnotations.value.push(createEmptyAnnotation()) }
  function removeSpecialAnnotation(i: number) { specialAnnotations.value.splice(i, 1) }
  function updateSpecialAnnotationTitle(i: number, v: string) { specialAnnotations.value[i].title = v }
  function updateSpecialAnnotationText(i: number, v: string) { specialAnnotations.value[i].text = v }

  // --- Evidence images ---
  async function addImages(e: Event) {
    const input = e.target as HTMLInputElement
    const files = input.files
    if (!files) return
    for (const file of Array.from(files)) {
      const src = await fileToBase64(file)
      images.value.push({ src, caption: '' })
    }
    input.value = ''
  }

  function removeImage(index: number) {
    images.value.splice(index, 1)
  }

  function updateImageCaption(index: number, caption: string) {
    images.value[index].caption = caption
  }

  // --- Logo ---
  async function handleLogoChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) return
    logo.value = await fileToBase64(files[0])
  }

  // --- Persistence ---
  async function loadBudget(id: string): Promise<number | undefined> {
    const b = await api.get<Budget>(`/budgets/${id}`)
    if (!b) return undefined
    correlativo.value = b.correlativo ?? null
    status.value = b.status ?? 'final'
    draftId.value = b.id ?? null
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
    specialAnnotations.value = normalizeSpecialAnnotations(b.specialAnnotations)
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

    return b.currentStep
  }

  function buildPayload() {
    return {
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
      specialAnnotations: specialAnnotations.value.filter((annotation) => annotation.text.trim()),
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
  }

  async function saveDraft(currentStep: number): Promise<number | false> {
    saving.value = true
    const payload = { ...buildPayload(), status: 'borrador', currentStep }
    try {
      const id = draftId.value
      if (id) {
        await api.put(`/budgets/${id}`, payload)
        return id
      } else {
        const created = await api.post<{ id: number }>('/budgets', payload)
        draftId.value = created.id
        return created.id
      }
    } catch (error) {
      toast.error(getSaveErrorMessage(error, 'Error al guardar el borrador. Intentá de nuevo.'))
      return false
    } finally {
      saving.value = false
    }
  }

  async function saveBudget(existingId?: string): Promise<boolean> {
    saving.value = true
    const payload = { ...buildPayload(), status: 'final', currentStep: 6 }
    try {
      const id = existingId || (draftId.value ? String(draftId.value) : null)
      if (id) {
        await api.put(`/budgets/${id}`, payload)
      } else {
        await api.post('/budgets', payload)
      }
      return true
    } catch (error) {
      toast.error(getSaveErrorMessage(error, 'Error al guardar el presupuesto. Intentá de nuevo.'))
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    company,
    client,
    correlativo,
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
    specialAnnotations,
    addFinding, removeFinding, updateFinding,
    addFindingImages, removeFindingImage, updateFindingImageCaption,
    addWork, removeWork, updateWork,
    addSpecialAnnotation, removeSpecialAnnotation, updateSpecialAnnotationTitle, updateSpecialAnnotationText,
    addImages,
    removeImage,
    updateImageCaption,
    handleLogoChange,
    loadBudget,
    saveDraft,
    saveBudget,
    draftId,
    status,
  }
}
