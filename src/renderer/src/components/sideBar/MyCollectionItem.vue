<script setup lang="ts">
import type { CollectionItem } from '@renderer/utils/songDB'
import { NEllipsis, NText } from 'naive-ui'

const props = defineProps<{
  collection: CollectionItem
}>()

const route = useRoute()

const selected = computed(() => {
  return route.name === 'collection' && route.params.bvid === props.collection.bvid
})
</script>

<template>
  <div
    class="grid-(~ cols-[32px_1fr]) gap-2 grid-items-center p1 rd-2 transition cursor-pointer hover select-none"
    :class="{
      selected,
    }"
    @click="$router.push({
      name: 'collection',
      params: {
        bvid: collection.bvid,
      },
    })"
  >
    <CoverImage size="32px" :src="collection.cover" />
    <NEllipsis :tooltip="{ placement: 'right', contentClass: 'w-240px' }" class="text-#A2A2A3">
      <NText>
        {{ collection.title }}
      </NText>
    </NEllipsis>
  </div>
</template>

<style scoped>
.selected {
  @apply 'bg-#282829'
}
.hover {
  @apply 'hover:bg-#282829'
}
</style>
