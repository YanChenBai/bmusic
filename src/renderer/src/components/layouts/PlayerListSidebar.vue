<script setup lang="ts">
import { useCollection } from '@renderer/stores/collection'

const { collections } = useCollection()
</script>

<template>
  <div class="w-full h-full bg-#171718 overflow-hidden">
    <NScrollbar class="h-full">
      <div class="box-border p2 grid gap-2">
        <div class="flex justify-between items-center box-border pr-1">
          <div class="text-#fff text-md font-bold">
            我的音乐
          </div>
          <NButton quaternary circle size="small">
            <template #icon>
              <NIcon :size="20">
                <div class="i-material-symbols:add-2-rounded" />
              </NIcon>
            </template>
          </NButton>
        </div>
        <MusicCollection v-for="collection in collections" :key="collection.bvid" :collection="collection" />
      </div>
    </NScrollbar>
  </div>
</template>

<style scoped>

</style>
