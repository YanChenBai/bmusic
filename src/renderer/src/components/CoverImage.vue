<script setup lang="ts">
const props = defineProps<{
  src?: string
  size: string
}>()

const _src = computed(() => {
  if (props.src && props.src?.length > 0)
    return props.src
  return undefined
})
</script>

<template>
  <NImage :preview-disabled="true" :width="size" :height="size" class="rd-1 select-none" :src="_src" object-fit="cover">
    <template #placeholder>
      <NSkeleton :height="size" :width="size" class="rd-1" />
    </template>
  </NImage>
</template>
