<script setup lang="ts">
import { useDB } from '@renderer/stores/db'
import { type Option, useContextMenu } from '@renderer/utils/contextMenu'

const { collections, removeCollection, modifyCollectionTitle } = useDB()
const [modalShow, modalToggle] = useToggle(false)
const curModalData = reactive<{ bvid?: string, title?: string }>({})

const options: Option[] = [
  {
    label: '修改名字',
    key: 'modifyName',
  },
  {
    label: '删除',
    key: 'delete',
  },
]

function findCollection(bvid: string) {
  return collections.value.find(collection => collection.bvid === bvid)
}

function updateTitle() {
  const { bvid, title } = toValue(curModalData)

  if (bvid && title) {
    modifyCollectionTitle(bvid, title)
      .then(() => modalToggle(false))
  }
}

const {
  onContextmenu,
  onClickoutside,
  handleSelect,
  showDropdown,
  x,
  y,
}
= useContextMenu('contextmenu', options, {
  delete: (bvid) => {
    const collection = findCollection(bvid)
    if (collection)
      removeCollection(bvid)
  },
  modifyName: (bvid) => {
    const collection = findCollection(bvid)
    if (!collection)
      return

    curModalData.bvid = bvid
    curModalData.title = collection.title

    modalToggle(true)
  },
})
</script>

<template>
  <div class="box-border grid gap-2" @contextmenu.stop.prevent="onContextmenu">
    <div class="flex justify-between items-center box-border pr-1">
      <div class="text-#fff text-3 font-bold select-none">
        我的合集
      </div>
      <!-- <NButton quaternary circle size="small" @click="$router.push({ name: 'home' })">
        <template #icon>
          <NIcon :size="18">
            <div class="i-material-symbols:add-2-rounded" />
          </NIcon>
        </template>
      </NButton> -->
    </div>
    <TransitionGroup name="list">
      <MyCollectionItem v-for="collection in collections" :key="collection.bvid" :collection="collection" :contextmenu="collection.bvid" />
    </TransitionGroup>

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

    <NModal v-model:show="modalShow">
      <NCard class="max-w-100" title="修改">
        <NFormItem label="合集名称">
          <NInput v-model:value="curModalData.title" />
        </NFormItem>
        <div class="grid grid-cols-2 gap-2">
          <NButton type="primary" @click="updateTitle">
            确定
          </NButton>
          <NButton @click="modalToggle(false)">
            取消
          </NButton>
        </div>
      </NCard>
    </NModal>
  </div>
</template>
