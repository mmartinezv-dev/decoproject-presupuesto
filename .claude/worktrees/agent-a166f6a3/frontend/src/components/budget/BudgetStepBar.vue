<script setup lang="ts">
const props = defineProps<{
  steps: string[]
  current: number
}>()

const emit = defineEmits<{ goto: [step: number] }>()
</script>

<template>
  <nav class="no-print flex items-start mb-8">
    <template v-for="(label, i) in steps" :key="i">
      <!-- Círculo + label -->
      <button class="flex flex-col items-center gap-1.5 shrink-0" @click="emit('goto', i + 1)">
        <div
          :class="[
            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
            i + 1 === current
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : i + 1 < current
                ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300'
                : 'bg-slate-100 text-slate-400',
          ]"
        >
          <svg v-if="i + 1 < current" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span
          :class="[
            'text-xs font-semibold whitespace-nowrap tracking-wide',
            i + 1 === current ? 'text-blue-600' : i + 1 < current ? 'text-blue-400' : 'text-slate-400',
          ]"
        >
          {{ label }}
        </span>
      </button>

      <!-- Línea conectora -->
      <div
        v-if="i < steps.length - 1"
        :class="[
          'flex-1 h-0.5 mt-4 mx-2 rounded transition-colors',
          i + 1 < current ? 'bg-blue-300' : 'bg-slate-200',
        ]"
      />
    </template>
  </nav>
</template>
