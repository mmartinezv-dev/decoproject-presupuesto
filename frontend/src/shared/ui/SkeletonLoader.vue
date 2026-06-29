<script setup lang="ts">
defineProps<{ width?: string; height?: string; rounded?: string }>()
</script>

<template>
  <div
    class="animate-pulse bg-zinc-200 dark:bg-zinc-700"
    :class="[width ?? 'w-full', height ?? 'h-4', rounded ?? 'rounded-md']"
  />
</template>
