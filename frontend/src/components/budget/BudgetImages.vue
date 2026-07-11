<script setup lang="ts">
withDefaults(defineProps<{
  images: { src: string; caption: string }[]
  title?: string
}>(), { title: 'Evidencia Fotográfica' })

const emit = defineEmits<{
  add: [event: Event]
  remove: [index: number]
  updateCaption: [index: number, caption: string]
}>()
</script>

<template>
  <div class="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
    <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">{{ title }}</h2>

    <!-- Grilla de imágenes -->
    <div v-if="images.length" class="grid grid-cols-2 gap-4 mb-4">
      <div v-for="(img, i) in images" :key="i" class="relative group flex flex-col gap-1.5">
        <div class="relative">
          <div class="w-full h-52 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
            <img
              :src="img.src"
              class="max-w-full max-h-full object-contain"
              :alt="img.caption || `Imagen ${i + 1}`"
            />
          </div>
          <button
            class="no-print absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            title="Eliminar imagen"
            @click="emit('remove', i)"
          >
            ✕
          </button>
        </div>
        <input
          :value="img.caption"
          class="no-print w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 placeholder-zinc-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          placeholder="Agregar descripción..."
          @input="emit('updateCaption', i, ($event.target as HTMLInputElement).value)"
        />
        <p
          v-if="img.caption"
          class="hidden print:block text-xs text-zinc-500 text-center italic mt-1"
        >
          {{ img.caption }}
        </p>
      </div>
    </div>

    <!-- Zona de carga -->
    <label
      class="no-print flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-brand-400 dark:hover:border-brand-600 rounded-xl p-6 cursor-pointer transition-colors text-zinc-400 dark:text-zinc-500 hover:text-brand-600 dark:hover:text-brand-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4-4 4 4 4-6 4 6M4 20h16M8 8a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
      <span class="text-sm font-medium">Agregar imágenes</span>
      <span class="text-xs">JPG, PNG, WEBP — podés seleccionar varias a la vez</span>
      <input type="file" accept="image/*" multiple class="hidden" @change="emit('add', $event)" />
    </label>
  </div>
</template>
