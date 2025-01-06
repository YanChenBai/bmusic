<script setup lang="ts">
const wrapEl = useTemplateRef('wrap')
const contentEl = useTemplateRef('content')

const isOverflow = computed(() => {
  return (wrapEl.value?.offsetWidth ?? 0) < (contentEl.value?.offsetWidth ?? 0)
})
</script>

<template>
  <div ref="wrap" class="w-full h-5 leading-5 overflow-hidden">
    <NMarquee v-if="isOverflow" :speed="20" auto-fill>
      <slot />
    </NMarquee>
    <div v-else>
      <slot />
    </div>
    <div ref="content" class="select-none w-fit">
      <slot />
    </div>
  </div>
</template>
