<script setup lang="ts">
import { useDB } from '@renderer/stores/db'
import { type Option, useContextMenu } from '@renderer/utils/contextMenu'

const { collections, removeCollection } = useDB()

const options: Option[] = [
  {
    label: '删除',
    key: 'delete',
  },
]

function findCollection(bvid: string) {
  return collections.value.find(collection => collection.bvid === bvid)
}

const { onContextmenu, onClickoutside, showDropdown, handleSelect, x, y }
= useContextMenu('contextmenu', options, {
  delete: (bvid) => {
    const collection = findCollection(bvid)
    if (collection)
      removeCollection(collection)
  },
})
</script>

<template>
  <div class="w-full h-full bg-#171718 overflow-hidden">
    <NScrollbar class="h-full">
      <div class="box-border p2 grid gap-2" @contextmenu.stop.prevent="onContextmenu">
        <div class="flex justify-between items-center box-border pr-1">
          <div class="text-#fff text-md font-bold">
            我的音乐
          </div>
          <!-- <NButton quaternary circle size="small">
            <template #icon>
              <NIcon :size="20">
                <div class="i-material-symbols:add-2-rounded" />
              </NIcon>
            </template>
          </NButton> -->
        </div>
        <TransitionGroup name="list">
          <MusicCollection v-for="collection in collections" :key="collection.bvid" :collection="collection" :contextmenu="collection.bvid" />
        </TransitionGroup>
      </div>
    </NScrollbar>

    <NDropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="options"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
      @select="handleSelect"
    />
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
