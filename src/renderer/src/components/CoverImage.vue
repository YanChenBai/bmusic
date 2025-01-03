<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
  size: string
  preview?: boolean
}>(), {
  preview: false,
})
</script>

<template>
  <NImage
    class="rd-1 select-none"
    object-fit="cover"
    :preview-disabled="!preview"
    :width="size"
    :height="size"
    :src="src"
    :previewed-img-props="{ class: 'max-w-500px rd-2' }"
    :show-toolbar="false"
  >
    <template #placeholder>
      <NSkeleton :height="size" :width="size" class="rd-1" />
    </template>
  </NImage>
</template>
