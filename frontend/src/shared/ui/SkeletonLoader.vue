<template>
  <div
    class="animate-pulse bg-gray-200 rounded"
    :class="[width ?? 'w-full', height ?? 'h-4']"
  />
</template>

<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
}>()
</script>
