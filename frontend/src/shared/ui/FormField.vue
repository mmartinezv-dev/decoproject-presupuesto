<script setup lang="ts">
defineProps<{ label: string; required?: boolean }>()
</script>

<template>
  <div>
    <label class="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
      {{ label }}<span v-if="required" class="ml-0.5 text-brand-500">*</span>
    </label>
    <slot />
  </div>
</template>
