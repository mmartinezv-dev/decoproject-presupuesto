<script setup lang="ts">
import SkeletonLoader from '../../../shared/ui/SkeletonLoader.vue'
withDefaults(defineProps<{ rows?: number }>(), { rows: 5 })
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
    <!-- Header skeleton -->
    <div class="flex items-center gap-6 border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
      <SkeletonLoader width="w-10" height="h-3" />
      <SkeletonLoader width="w-20" height="h-3" />
      <SkeletonLoader width="w-32" height="h-3" />
      <SkeletonLoader width="w-16" height="h-3" class="ml-auto" />
      <SkeletonLoader width="w-16" height="h-3" />
    </div>
    <!-- Row skeletons -->
    <div
      v-for="i in rows"
      :key="i"
      class="flex items-center gap-6 border-b border-zinc-100 px-4 py-3.5 last:border-0 dark:border-zinc-800"
    >
      <SkeletonLoader width="w-10" height="h-5" rounded="rounded-md" />
      <SkeletonLoader width="w-24" height="h-4" />
      <SkeletonLoader width="w-40" height="h-4" />
      <SkeletonLoader width="w-20" height="h-4" class="ml-auto" />
      <SkeletonLoader width="w-14" height="h-7" rounded="rounded-md" />
    </div>
  </div>
</template>
