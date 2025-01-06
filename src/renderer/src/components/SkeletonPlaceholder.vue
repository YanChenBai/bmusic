<script setup lang="ts">
withDefaults(defineProps<{
  repeat?: number
  loading?: boolean
  skeletonClass?: string
}>(), {
  repeat: 1,
  loading: false,
})
</script>

<template>
  <NSkeleton v-if="loading" :repeat="repeat" class="rd-1" :class="skeletonClass" />
  <slot v-else />
</template>
