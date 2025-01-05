<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex items-center justify-between py3">
    <NText class="text-3.5 font-500">
      {{ title }}
    </NText>
    <slot />
  </div>
</template>
