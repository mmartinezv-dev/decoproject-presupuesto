<template>
  <div class="w-full bg-white rounded shadow overflow-hidden">
    <div class="bg-gray-100 flex gap-4 p-2">
      <SkeletonLoader width="w-6"  height="h-4" />
      <SkeletonLoader width="w-24" height="h-4" />
      <SkeletonLoader width="w-36" height="h-4" />
      <SkeletonLoader class="ml-auto" width="w-20" height="h-4" />
    </div>
    <div
      v-for="i in rows"
      :key="i"
      class="flex items-center gap-4 p-3 border-t"
    >
      <SkeletonLoader width="w-6"  height="h-4" />
      <SkeletonLoader width="w-20" height="h-4" />
      <SkeletonLoader width="w-44" height="h-4" />
      <SkeletonLoader class="ml-auto" width="w-24" height="h-4" />
      <SkeletonLoader width="w-20" height="h-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonLoader from '../../../shared/ui/SkeletonLoader.vue'

withDefaults(defineProps<{ rows?: number }>(), { rows: 5 })
</script>
