<script setup lang="ts">
defineProps<{
  src?: string
  size: string
}>()
</script>

<template>
  <NImage :preview-disabled="true" :width="size" :height="size" class="rd-1 select-none" :src="src" object-fit="cover">
    <template #placeholder>
      <NSkeleton :height="size" :width="size" class="rd-1" />
    </template>
  </NImage>
</template>
