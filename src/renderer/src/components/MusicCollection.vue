<script setup lang="ts">
import type { CollectionItem } from '@renderer/stores/collection'
import { NEllipsis, NText } from 'naive-ui'

defineProps<{
  collection: CollectionItem
}>()
</script>

<template>
  <div
    class="grid-(~ cols-[32px_1fr]) gap-2 grid-items-center p1 rd-2 transition cursor-pointer hover"
    @click="$router.push({
      name: 'collection',
      params: {
        bvid: collection.bvid,
      },
    })"
  >
    <CoverImage size="32px" :src="collection.cover" />
    <NEllipsis :tooltip="{ placement: 'right' }">
      <NText class="text-#A2A2A3">
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
