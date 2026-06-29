<script setup lang="ts">
defineProps<{
  findings: { text: string; images: { src: string; caption: string }[] }[]
  summary: string
  works: string[]
}>()

const emit = defineEmits<{
  addFinding: []
  removeFinding: [index: number]
  updateFinding: [index: number, value: string]
  addFindingImages: [findingIndex: number, event: Event]
  removeFindingImage: [findingIndex: number, imageIndex: number]
  updateFindingImageCaption: [findingIndex: number, imageIndex: number, caption: string]
  'update:summary': [value: string]
  addWork: []
  removeWork: [index: number]
  updateWork: [index: number, value: string]
}>()
</script>

<template>
  <div class="space-y-8">

    <!-- ── Informe de Visita ── -->
    <div class="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5">
      <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Informe de Visita</h2>

      <!-- Resumen -->
      <div class="mb-6">
        <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Resumen</p>
        <textarea
          :value="summary"
          rows="4"
          class="no-print w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="Resumen general de la visita..."
          @input="emit('update:summary', ($event.target as HTMLTextAreaElement).value)"
        />
        <p v-if="summary" class="hidden print:block text-sm text-zinc-700 whitespace-pre-line">{{ summary }}</p>
      </div>

      <!-- Hallazgos -->
      <div>
        <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Hallazgos</p>

        <div class="space-y-3">
          <div
            v-for="(f, i) in findings"
            :key="i"
            class="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50/50 dark:bg-zinc-800/50"
          >
            <!-- Texto del hallazgo -->
            <div class="flex gap-2 items-start mb-3 no-print">
              <span class="text-zinc-400 text-sm w-5 shrink-0 mt-2.5 font-medium">{{ i + 1 }}.</span>
              <input
                :value="f.text"
                class="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Describir hallazgo..."
                @input="emit('updateFinding', i, ($event.target as HTMLInputElement).value)"
              />
              <button
                v-if="findings.length > 1"
                class="mt-1.5 rounded-md p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                @click="emit('removeFinding', i)"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Texto solo impresión -->
            <div class="hidden print:flex gap-2 items-start mb-2">
              <span class="text-zinc-400 text-sm shrink-0">{{ i + 1 }}.</span>
              <span class="text-sm text-zinc-700">{{ f.text }}</span>
            </div>

            <!-- Imágenes del hallazgo -->
            <div :class="f.images.length ? 'mt-2' : ''">
              <div v-if="f.images.length" class="grid grid-cols-3 gap-2 mb-3">
                <div v-for="(img, j) in f.images" :key="j" class="relative group flex flex-col gap-1">
                  <div class="relative">
                    <img
                      :src="img.src"
                      :alt="img.caption || `Imagen ${j + 1}`"
                      class="w-full h-28 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                    />
                    <button
                      class="no-print absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="emit('removeFindingImage', i, j)"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    :value="img.caption"
                    class="no-print w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-600 placeholder-zinc-300 focus:border-brand-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    placeholder="Descripción..."
                    @input="emit('updateFindingImageCaption', i, j, ($event.target as HTMLInputElement).value)"
                  />
                  <p v-if="img.caption" class="hidden print:block text-xs text-zinc-500 text-center italic">{{ img.caption }}</p>
                </div>
              </div>

              <label class="no-print inline-flex items-center gap-1.5 text-xs text-brand-700 dark:text-brand-400 hover:text-brand-900 cursor-pointer transition-colors border border-dashed border-brand-300 dark:border-brand-700 hover:border-brand-500 rounded-lg px-3 py-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4-4 4 4 4-6 4 6M4 20h16M8 8a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                Agregar imágenes
                <input type="file" accept="image/*" multiple class="hidden" @change="emit('addFindingImages', i, $event)" />
              </label>
            </div>
          </div>
        </div>

        <button
          class="no-print mt-3 text-sm text-brand-700 dark:text-brand-400 hover:text-brand-900 font-medium transition-colors"
          @click="emit('addFinding')"
        >
          + Agregar hallazgo
        </button>
      </div>
    </div>

    <!-- ── Obras Preliminares ── -->
    <div class="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5">
      <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Obras Preliminares</h2>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-3 no-print">Puntos a abordar en la intervención</p>

      <div class="no-print space-y-2">
        <div v-for="(w, i) in works" :key="i" class="flex gap-2 items-center">
          <span class="text-brand-500 font-bold text-sm shrink-0">▸</span>
          <input
            :value="w"
            class="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Describir punto a abordar..."
            @input="emit('updateWork', i, ($event.target as HTMLInputElement).value)"
          />
          <button
            v-if="works.length > 1"
            class="rounded-md p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
            @click="emit('removeWork', i)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <button
          class="mt-1 text-sm text-brand-700 dark:text-brand-400 hover:text-brand-900 font-medium transition-colors"
          @click="emit('addWork')"
        >
          + Agregar punto
        </button>
      </div>

      <ul class="hidden print:block space-y-1.5 pl-0 list-none">
        <li v-for="(w, i) in works.filter(Boolean)" :key="i" class="text-sm text-zinc-700 flex gap-2">
          <span class="text-brand-600 font-bold shrink-0">▸</span>
          <span>{{ w }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>
