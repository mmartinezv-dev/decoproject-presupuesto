<script setup lang="ts">
defineProps<{
  steps: string[]
  current: number
}>()

const emit = defineEmits<{ goto: [step: number] }>()
</script>

<template>
  <nav class="no-print flex items-start mb-8">
    <template v-for="(label, i) in steps" :key="i">
      <button class="flex flex-col items-center gap-1.5 shrink-0" @click="emit('goto', i + 1)">
        <div
          :class="[
            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
            i + 1 === current
              ? 'bg-brand-800 text-white shadow-md shadow-brand-900/30'
              : i + 1 < current
                ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-300 dark:bg-brand-900/30 dark:text-brand-400 dark:ring-brand-700'
                : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500',
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
            i + 1 === current
              ? 'text-brand-800 dark:text-brand-400'
              : i + 1 < current
                ? 'text-brand-600 dark:text-brand-500'
                : 'text-zinc-400 dark:text-zinc-500',
          ]"
        >
          {{ label }}
        </span>
      </button>
      <div
        v-if="i < steps.length - 1"
        :class="[
          'flex-1 h-0.5 mt-4 mx-2 rounded transition-colors',
          i + 1 < current ? 'bg-brand-300 dark:bg-brand-800' : 'bg-zinc-200 dark:bg-zinc-700',
        ]"
      />
    </template>
  </nav>
</template>
