<script setup lang="ts">
import { computed } from 'vue'
import type { SpecialAnnotation } from '../../types'

const props = defineProps<{
  annotations: SpecialAnnotation[]
}>()

defineEmits<{
  add: []
  remove: [index: number]
  updateTitle: [index: number, value: string]
  updateText: [index: number, value: string]
}>()

const hasPrintableAnnotations = computed(() =>
  props.annotations.some((annotation) => annotation.text.trim()),
)
</script>

<template>
  <section
    class="print-section mb-6 rounded-xl border border-zinc-200 bg-white p-5 print:hidden dark:border-zinc-800 dark:bg-zinc-900"
    :class="{ 'print:!block': hasPrintableAnnotations }"
  >
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Anotaciones Especiales
      </h2>
      <button
        type="button"
        class="no-print rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-brand-600"
        @click="$emit('add')"
      >
        + Agregar anotación
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="(annotation, index) in annotations"
        :key="index"
        class="rounded-lg border border-zinc-100 bg-zinc-50 p-4 print:hidden dark:border-zinc-800 dark:bg-zinc-800/50"
        :class="{ 'print:!block': annotation.text.trim() }"
      >
        <div class="no-print mb-3 flex items-center justify-between gap-3">
          <input
            :value="annotation.title"
            class="w-full max-w-xs border-b border-transparent bg-transparent text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:border-zinc-300 focus:border-brand-500 focus:outline-none dark:text-zinc-400 dark:hover:border-zinc-600"
            placeholder="Título de anotación"
            @input="$emit('updateTitle', index, ($event.target as HTMLInputElement).value)"
          />
          <button
            v-if="annotations.length > 1"
            type="button"
            class="text-xs font-medium text-red-500 transition-colors hover:text-red-600"
            @click="$emit('remove', index)"
          >
            Eliminar
          </button>
        </div>

        <textarea
          :value="annotation.text"
          rows="5"
          class="no-print w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="Escribí aquí cualquier anotación especial, observación técnica o indicación para este presupuesto..."
          @input="$emit('updateText', index, ($event.target as HTMLTextAreaElement).value)"
        ></textarea>

        <h3
          v-if="annotation.text.trim() && annotation.title.trim()"
          class="hidden text-xs font-semibold uppercase tracking-widest text-zinc-400 print:block"
        >
          {{ annotation.title }}
        </h3>
        <p
          v-if="annotation.text.trim()"
          class="hidden whitespace-pre-line text-sm leading-relaxed text-zinc-600 print:block"
        >
          {{ annotation.text }}
        </p>
      </div>
    </div>
  </section>
</template>
