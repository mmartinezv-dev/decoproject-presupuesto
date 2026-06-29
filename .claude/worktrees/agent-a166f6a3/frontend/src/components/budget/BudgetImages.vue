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
  <div class="mt-6">
    <h2 class="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">{{ title }}</h2>

    <!-- Grilla de imágenes -->
    <div v-if="images.length" class="grid grid-cols-2 gap-4 mb-4">
      <div v-for="(img, i) in images" :key="i" class="relative group flex flex-col gap-1">
        <div class="relative">
          <img
            :src="img.src"
            class="w-full h-48 object-cover rounded-lg border border-slate-200"
            :alt="img.caption || `Imagen ${i + 1}`"
          />
          <button
            class="no-print absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Eliminar imagen"
            @click="emit('remove', i)"
          >
            ✕
          </button>
        </div>
        <!-- Caption editable en pantalla -->
        <input
          :value="img.caption"
          class="no-print w-full text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 placeholder-slate-300 focus:border-blue-400 focus:outline-none"
          placeholder="Agregar descripción..."
          @input="emit('updateCaption', i, ($event.target as HTMLInputElement).value)"
        />
        <!-- Caption solo en impresión -->
        <p
          v-if="img.caption"
          class="hidden print:block text-xs text-slate-500 text-center italic mt-1"
        >
          {{ img.caption }}
        </p>
      </div>
    </div>

    <!-- Zona de carga -->
    <label
      class="no-print flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-lg p-6 cursor-pointer transition-colors text-slate-400 hover:text-blue-600"
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
