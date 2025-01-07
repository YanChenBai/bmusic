<script setup lang="ts">
const wrapEl = useTemplateRef('wrap')
const contentEl = useTemplateRef('content')

const isOverflow = computed(() => {
  return (wrapEl.value?.offsetWidth ?? 0) < (contentEl.value?.offsetWidth ?? 0)
})

const distance = computed(() => (wrapEl.value?.offsetWidth ?? 0) - (contentEl.value?.offsetWidth ?? 0))
const distancePx = computed(() => `${distance.value}px`)

const duration = computed(() => {
  return `${Math.abs(distance.value) / 10}s`
})
</script>

<template>
  <div ref="wrap" class="w-full h-5 leading-5 overflow-hidden">
    <div :class="{ scroll: isOverflow }">
      <slot />
    </div>
    <div ref="content" class="select-none w-fit">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scroll {
  animation-name: scroll;
  animation-duration: v-bind(duration);
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(v-bind(distancePx));
  }
  100% {
    transform: translateX(0);
  }
}
</style>
