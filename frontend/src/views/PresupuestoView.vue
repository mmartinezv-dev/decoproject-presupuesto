<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { api } from '../composables/useApi'
import { useBudget } from '../composables/useBudget'
import { useProductSearch } from '../composables/useProductSearch'
import type { Client, CompanyInfo } from '../types'

import SkeletonLoader from '../shared/ui/SkeletonLoader.vue'
import BudgetStepBar from '../components/budget/BudgetStepBar.vue'
import BudgetHeader from '../components/budget/BudgetHeader.vue'
import BudgetInspection from '../components/budget/BudgetInspection.vue'
import BudgetClientSection from '../components/budget/BudgetClientSection.vue'
import BudgetItemsTable from '../components/budget/BudgetItemsTable.vue'
import BudgetTotals from '../components/budget/BudgetTotals.vue'
import BudgetNotes from '../components/budget/BudgetNotes.vue'
import BudgetImages from '../components/budget/BudgetImages.vue'
import BudgetActions from '../components/budget/BudgetActions.vue'

const props = defineProps<{ id?: string }>()
const router = useRouter()

const STEPS = ['Empresa', 'Cliente', 'Inspección', 'Detalle', 'Finalizar']
const currentStep = ref(1)
const budgetContainerRef = ref<HTMLElement | null>(null)
const exportingPdf = ref(false)

const {
  company, client, correlativo, logo, notes, sections, images, saving, today,
  neto, iva, total,
  addRow, removeRow, addSection, removeSection, updateSectionTitle,
  visitFindings, visitSummary, preliminaryWorks,
  addFinding, removeFinding, updateFinding,
  addFindingImages, removeFindingImage, updateFindingImageCaption,
  addWork, removeWork, updateWork,
  addImages, removeImage, updateImageCaption,
  handleLogoChange,
  loadBudget, saveBudget,
} = useBudget()

const { searchResults, activeSectionIndex, activeRowIndex, search, pick, close } = useProductSearch()

const clients = ref<Client[]>([])
const loading = ref(true)

function updateCompanyField(field: keyof CompanyInfo, value: string) {
  company[field] = value
}

function selectClient(c: Client) {
  Object.assign(client, c)
}

function updateClientField(field: string, value: string) {
  ;(client as Record<string, unknown>)[field] = value
}

function updateItem(sectionIndex: number, rowIndex: number, field: string, value: string | number) {
  ;(sections.value[sectionIndex].items[rowIndex] as Record<string, unknown>)[field] = value
}

function pickProduct(product: Parameters<typeof pick>[0], sectionIndex: number, rowIndex: number) {
  pick(product, sections.value[sectionIndex].items[rowIndex])
}

function handlePrint() {
  window.print()
}

async function handleExportPdf() {
  const html2pdf = (await import('html2pdf.js')).default
  exportingPdf.value = true
  await nextTick()

  const element = budgetContainerRef.value
  if (!element) {
    exportingPdf.value = false
    return
  }

  const clientName = client.name || 'presupuesto'
  const filename = `presupuesto-${clientName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`

  await html2pdf()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .set({
      margin: [10, 10, 10, 10],
      filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    } as any)
    .from(element)
    .save()

  exportingPdf.value = false
}

async function handleSave() {
  const ok = await saveBudget(props.id)
  if (ok) {
    toast.success('Presupuesto guardado correctamente')
    router.push('/presupuestos')
  }
}

onMounted(async () => {
  try {
    clients.value = await api.get('/clients')
    if (props.id) await loadBudget(props.id)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Skeleton inicial mientras cargan clientes / presupuesto existente -->
  <div v-if="loading" class="mx-auto max-w-[210mm] space-y-4 p-8">
    <SkeletonLoader height="h-24" />
    <SkeletonLoader height="h-16" />
    <SkeletonLoader height="h-64" />
  </div>

  <div v-else class="relative print:p-0" :class="{ 'pdf-exporting': exportingPdf }">
    <!-- Marca de agua -->
    <div class="hidden print:flex fixed inset-0 z-0 items-center justify-center pointer-events-none">
      <img
        src="/img/site-engineer-construction-site.jpg"
        alt=""
        class="w-full h-full object-cover object-center opacity-[0.06] grayscale mix-blend-multiply"
      />
    </div>

    <div ref="budgetContainerRef" class="relative z-10 max-w-[210mm] mx-auto bg-white print:bg-transparent shadow-lg print:shadow-none rounded-xl print:rounded-none p-8 print:p-0">

      <!-- Breadcrumb steps -->
      <BudgetStepBar v-show="!exportingPdf" :steps="STEPS" :current="currentStep" @goto="currentStep = $event" />

      <!-- ── STEP 1: Empresa ── -->
      <div v-show="currentStep === 1 || exportingPdf" class="print:!block">
        <BudgetHeader
          :company="company"
          :logo="logo"
          :date="today"
          :correlativo="correlativo"
          @update:company="updateCompanyField"
          @update:logo="handleLogoChange"
        />
        <div class="no-print flex justify-end mt-6">
          <button class="px-5 py-2.5 bg-brand-800 text-white text-sm font-semibold rounded-lg hover:bg-brand-900 transition-colors" @click="currentStep = 2">
            Siguiente →
          </button>
        </div>
      </div>

      <!-- ── STEP 2: Cliente ── -->
      <div v-show="currentStep === 2 || exportingPdf" class="print:!block">
        <BudgetClientSection
          :client="client"
          :clients="clients"
          @select-client="selectClient"
          @update:field="updateClientField"
        />
        <div class="no-print flex justify-between mt-6">
          <button class="px-5 py-2.5 border border-zinc-300 text-zinc-600 text-sm font-semibold rounded-lg hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors" @click="currentStep = 1">
            ← Anterior
          </button>
          <button class="px-5 py-2.5 bg-brand-800 text-white text-sm font-semibold rounded-lg hover:bg-brand-900 transition-colors" @click="currentStep = 3">
            Siguiente →
          </button>
        </div>
      </div>

      <!-- ── STEP 3: Inspección ── -->
      <div v-show="currentStep === 3 || exportingPdf" class="print:!block">
        <BudgetInspection
          :findings="visitFindings"
          :summary="visitSummary"
          :works="preliminaryWorks"
          @add-finding="addFinding"
          @remove-finding="removeFinding"
          @update-finding="updateFinding"
          @add-finding-images="addFindingImages"
          @remove-finding-image="removeFindingImage"
          @update-finding-image-caption="updateFindingImageCaption"
          @update:summary="visitSummary = $event"
          @add-work="addWork"
          @remove-work="removeWork"
          @update-work="updateWork"
        />
        <div class="no-print flex justify-between mt-6">
          <button class="px-5 py-2.5 border border-zinc-300 text-zinc-600 text-sm font-semibold rounded-lg hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors" @click="currentStep = 2">
            ← Anterior
          </button>
          <button class="px-5 py-2.5 bg-brand-800 text-white text-sm font-semibold rounded-lg hover:bg-brand-900 transition-colors" @click="currentStep = 4">
            Siguiente →
          </button>
        </div>
      </div>

      <!-- ── STEP 4: Detalle ── -->
      <div v-show="currentStep === 4 || exportingPdf" class="print:!block">
        <BudgetItemsTable
          v-for="(section, si) in sections"
          :key="si"
          :section-index="si"
          :title="section.title"
          :items="section.items"
          :search-results="searchResults"
          :active-section-index="activeSectionIndex"
          :active-row-index="activeRowIndex"
          :can-remove="sections.length > 1"
          @search="search"
          @pick="pickProduct"
          @close-search="close"
          @add-row="addRow"
          @remove-row="removeRow"
          @update-item="updateItem"
          @update-title="updateSectionTitle"
          @remove-section="removeSection"
        />

        <div class="no-print mb-4">
          <button
            class="text-sm text-zinc-500 hover:text-brand-700 border border-dashed border-zinc-300 hover:border-brand-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-brand-600 rounded-lg px-4 py-2 transition-colors w-full"
            @click="addSection"
          >
            + Agregar sección
          </button>
        </div>

        <BudgetTotals :neto="neto" :iva="iva" :total="total" />

        <div class="no-print flex justify-between mt-6">
          <button class="px-5 py-2.5 border border-zinc-300 text-zinc-600 text-sm font-semibold rounded-lg hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors" @click="currentStep = 3">
            ← Anterior
          </button>
          <button class="px-5 py-2.5 bg-brand-800 text-white text-sm font-semibold rounded-lg hover:bg-brand-900 transition-colors" @click="currentStep = 5">
            Siguiente →
          </button>
        </div>
      </div>

      <!-- ── STEP 5: Finalizar ── -->
      <div v-show="currentStep === 5 || exportingPdf" class="print:!block">
        <BudgetImages
          title="Diseños y Renders (opcional)"
          :images="images"
          @add="addImages"
          @remove="removeImage"
          @update-caption="updateImageCaption"
        />

        <BudgetNotes v-model="notes" />

        <div class="no-print flex justify-between mt-6 mb-4">
          <button class="px-5 py-2.5 border border-zinc-300 text-zinc-600 text-sm font-semibold rounded-lg hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors" @click="currentStep = 4">
            ← Anterior
          </button>
        </div>

        <BudgetActions :saving="saving" @save="handleSave" @print="handlePrint" @pdf="handleExportPdf" />
      </div>

      <!-- Pie de página (solo print y PDF) -->
      <div class="print-section hidden print:block mt-8 pt-4 border-t border-zinc-300 text-center">
        <p class="text-xs text-zinc-400">{{ company.name }} &middot; {{ company.rut }} &middot; {{ company.phone }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pdf-exporting :deep(.no-print) {
  display: none !important;
}
.pdf-exporting .print-section {
  display: block !important;
}
</style>
