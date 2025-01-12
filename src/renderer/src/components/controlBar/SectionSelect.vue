<script setup lang="ts">
const { curPlaySong, playerInfo } = usePlayerStoreRefs()
const { data: viewPoints } = useQuery({
  key: () => ['getPlayerInfo', curPlaySong.value?.bvid ?? '', curPlaySong.value?.cid ?? ''],
  query: async () => {
    const bvid = curPlaySong.value?.bvid
    const cid = curPlaySong.value?.cid

    if (!bvid || !cid)
      return []

    return await window.invokes.getPlayerInfo(bvid, cid)
      .then(({ data, code, message: msg }) => {
        if (code !== 0) {
          message.error(msg ?? '获取播放进度失败~')
          return []
        }

        return data.view_points
      })
  },
})

const curSection = computed(() => {
  const progress = playerInfo.value?.progress ?? 0
  return viewPoints.value?.findIndex(item => item.from < progress && item.to > progress) ?? 0
})

const jump = (time: number) => jumpProgress(time)
</script>

<template>
  <NConfigProvider
    abstract :theme-overrides="{
      Popover: {
        padding: '0px',
      },
    }"
  >
    <NPopover
      trigger="click"
    >
      <template #trigger>
        <div>
          <Transition>
            <NTag v-show="Boolean(viewPoints?.length)" size="small" class="px2 py2.5 text-3 rd-2 cursor-pointer mr-2 select-none">
              章节
            </NTag>
          </Transition>
        </div>
      </template>
      <NScrollbar style="height: 380px;" content-class="p3">
        <NList clickable hoverable :show-divider="false" size="small">
          <NListItem v-for="(item, index) in viewPoints" :key="index" class="!p1" @click="() => jump(item.from)">
            <div
              class="flex items-center gap-2"
              :class="{
                'text-#FF6699': index === curSection,
              }"
            >
              <CoverImage :src="item.imgUrl" size="32px" />
              <NEllipsis w-200px :tooltip="{ placement: 'right', contentClass: 'w-240px p2' }">
                {{ item.content }}
              </NEllipsis>
            </div>
          </NListItem>
        </NList>
      </NScrollbar>
    </NPopover>
  </NConfigProvider>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(8px);
}
</style>
