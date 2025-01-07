<script setup lang="ts">
import { useDB } from '@renderer/stores/db'

const { collections } = useDB()
</script>

<template>
  <div>
    <NScrollbar class="h-[calc(100vh-80px-60px)]">
      <div class="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p3 box-border gap-3">
        <NCard
          v-for="{ bvid, cover, title } in collections"
          :key="bvid"
          class=" cursor-pointer"
          hoverable
          content-class="!px2 !py1"
          @click="$router.push({ name: 'collection', params: { bvid } })"
        >
          <template #cover>
            <CoverImage size="full" class="aspect-square" :src="cover" />
          </template>

          <NEllipsis :line-clamp="2" :tooltip="{ placement: 'bottom', contentClass: 'w-200px' }">
            <span class="text-3">{{ title }}</span>
          </NEllipsis>
        </NCard>
      </div>
    </NScrollbar>
  </div>
</template>
