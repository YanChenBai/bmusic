<script setup lang="ts">
defineProps<{
  content: string
}>()

const wrapEl = useTemplateRef('wrap')
const contentEl = useTemplateRef('content')

const isOverflow = computed(() => {
  return (wrapEl.value?.offsetHeight ?? 0) < (contentEl.value?.offsetHeight ?? 0)
})
</script>

<template>
  <div ref="wrap" class="w-full overflow-hidden h-5 leading-5">
    <NMarquee v-if="isOverflow" :speed="20" auto-fill>
      <span>{{ content }}</span>
    </NMarquee>
    <div v-else>
      {{ content }}
    </div>
    <div ref="content" class="select-none ">
      {{ content }}
    </div>
  </div>
</template>
