<script setup lang="ts">
const [drawerState, drawerToggle] = useToggle(false)
const [checkboxState, checkboxToggle] = useToggle(false)
const { playlist, delPlaylist } = usePlayer()
const selectedSongs = ref<string[]>([])
const isSelectedAll = ref(false)

function handleClick(e: MouseEvent) {
  if (!checkboxState.value)
    return

  const clickItem = (e.target as HTMLDivElement).closest('[checkbox]')
  if (!clickItem)
    return

  const checkboxEl = clickItem.querySelector<HTMLDivElement>('.n-checkbox')

  if (checkboxEl) {
    checkboxEl.click()
  }
}

// 批量删除
function batchDel() {
  if (selectedSongs.value.length <= 0)
    return

  selectedSongs.value.forEach((v) => {
    const [bvid, cid] = v.split(':')
    delPlaylist({ bvid, cid: Number(cid) })
  })

  selectedSongs.value = []
}

// 监听是否开启多选
watchEffect(() => {
  if (!checkboxState.value)
    selectedSongs.value = []
})

// 监听全选状态变更
watchEffect(() => {
  if (isSelectedAll.value) {
    selectedSongs.value = playlist.value.map(v => `${v.bvid}:${v.cid}`)
  }
  else {
    selectedSongs.value = []
  }
})
</script>

<template>
  <div class="pr-7 text-#A5A5A5">
    <NBadge :value="playlist.length">
      <NButton @click="() => drawerToggle()">
        <template #icon>
          <NIcon size="28">
            <div class="i-material-symbols:playlist-play-rounded" />
          </NIcon>
        </template>
      </NButton>
    </NBadge>

    <NDrawer v-model:show="drawerState" :width="360" placement="right">
      <NDrawerContent>
        <template #header>
          <div class="h-27px flex items-center justify-between px-5 py-3 select-none drag">
            <div class="text-4">
              播放列表
            </div>
            <div class="flex gap-2">
              <NButton class="no-drag" size="small" :type="checkboxState ? 'primary' : undefined" @click="checkboxToggle()">
                <NIcon size="18">
                  <div class="i-material-symbols:checklist-rounded" />
                </NIcon>
              </NButton>
              <NButton class="no-drag" size="small" @click="batchDel">
                <NIcon size="18">
                  <div class="i-material-symbols:delete-rounded" />
                </NIcon>
              </NButton>
            </div>
          </div>
        </template>

        <NScrollbar class="px3 box-border pos-relative">
          <div v-show="checkboxState" class="pt-2 pl2">
            <!-- <NCheckbox v-model:checked="isSelectedAll" size="small" label="全选" />
            <NDivider vertical /> -->
            已选中{{ selectedSongs.length }}首
          </div>
          <NCheckboxGroup v-if="playlist.length" v-model:value="selectedSongs" class="mb3">
            <div
              v-for="item in playlist"
              :key="`${item.bvid}-${item.cid}`"
              checkbox
              class="flex items-center gap-2 bg pos-relative group overflow-hidden"
              @click="handleClick"
            >
              <NCheckbox v-show="checkboxState" size="small" :value="`${item.bvid}:${item.cid}`" @click.stop />
              <CoverImage :src="item.cover" size="36px" class="flex-shrink-0" />
              <div class="flex flex-col overflow-hidden pr2 box-border select-none">
                <NEllipsis :tooltip="{ placement: 'bottom' }">
                  {{ item.name }}
                </NEllipsis>
                <div class="text-(3 #A5A5A5)">
                  {{ item.author }}
                </div>
              </div>
              <div class="pos-absolute right-2 top-0 h-full group-hover:flex items-center hidden">
                <NButton circle secondary @click.stop="() => delPlaylist(item)">
                  <template #icon>
                    <NIcon>
                      <div class="i-material-symbols:delete-rounded" />
                    </NIcon>
                  </template>
                </NButton>
              </div>
            </div>
          </NCheckboxGroup>

          <NResult v-else class="mt-10" status="404" title="歌单是空的哦~" description="找点对胃口的歌吧~" />
        </NScrollbar>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped>
.bg {
  @apply rd-1 p2
}
.bg:nth-child(2n) {
  @apply bg-#000/10;
}
</style>
