<script setup lang="ts">
import type { PlaylistSong } from '@renderer/types/playlist'
import SongTable from '@renderer/components/songTable'
import { useDB } from '@renderer/stores/db'
import { usePlaylistStore } from '@renderer/stores/playlist'
import { NEllipsis, NSpin } from 'naive-ui'

const props = defineProps<{
  bvid: string
}>()

const playlistStore = usePlaylistStore()
const { setPlaySong } = usePlayerStore()
const { addCollection } = useDB()

const { data, error, isLoading } = useQuery({
  key: () => ['getPlayerData', props.bvid],
  query: async () => {
    return await window.invokes.getPlaylist(props.bvid)
      .then(({ data, code, message: msg }) => {
        if (code !== 0)
          throw new Error(msg ?? '获取列表失败~')

        const map = new Map<string, PlaylistSong>()

        // 视频列表转换通用数据
        for (const item of data.pages) {
          const val = {
            bvid: data.bvid,
            cid: item.cid,
            cover: item.first_frame ?? data.pic,
            name: item.part,
            author: data.owner.name,
            longTime: item.duration,
          }
          map.set(`${data.bvid}:${item.cid}`, val)
        }

        // 合集视频转换为通用数据
        if (data.season_id) {
          data.ugc_season.sections
            .map(item => item.episodes)
            .flat()
            .forEach((item) => {
              const val = {
                bvid: item.bvid,
                cid: item.page.cid,
                cover: item.arc.pic,
                name: item.arc.title,
                author: '-',
                longTime: item.page.duration,
              }
              map.set(`${item.bvid}:${item.page.cid}`, val)
            })
        }

        return {
          title: data.title,
          desc: data.desc,
          author: data.owner.name,
          uface: data.owner.face,
          cover: data.pic,
          list: map.entries().map(([_, v]) => v).toArray(),
        }
      })
  },
})

function playCollection() {
  const list = data.value?.list
  if (!list || list.length === 0)
    return

  playlistStore.push(list)
  setPlaySong(list[0])
}

function onAddCollection() {
  addCollection({
    bvid: props.bvid,
    title: data.value?.title ?? '',
    cover: data.value?.cover ?? '',
  })
}
</script>

<template>
  <NSpin :show="isLoading">
    <NScrollbar class="h-[calc(100vh-80px-60px)]">
      <div class="p-4 box-border grid gap-4">
        <NResult v-if="error" status="404" title="请求错误" description="生活总归带点荒谬" class="mt-30" />
        <template v-else>
          <div class="grid-(~ cols-[128px_1fr]) gap-4">
            <CoverImage size="128px" class="rd-2" :src="data?.cover" :preview="true" />
            <div class="flex flex-col">
              <div class="flex flex-col gap-1">
                <SkeletonPlaceholder :loading="isLoading" skeleton-class="max-w-360px">
                  <NEllipsis line-clamp="2" expand-trigger="click" :tooltip="false">
                    <span class="text-xl">
                      {{ data?.title }}
                    </span>
                  </NEllipsis>
                </SkeletonPlaceholder>

                <div class="flex gap-2">
                  <CoverImage size="16px" class="rd-full" :src="data?.cover" />
                  <SkeletonPlaceholder :loading="isLoading" skeleton-class="max-w-300px">
                    <span class="text-(3 #A2A2A3)">{{ data?.author }}</span>
                  </SkeletonPlaceholder>
                </div>

                <SkeletonPlaceholder :loading="isLoading" skeleton-class="max-w-300px" :repeat="2">
                  <div class="text-(3 #A2A2A3)">
                    <NEllipsis class="overflow-hidden whitespace-pre-line max-w-600px" expand-trigger="click" line-clamp="1" :tooltip="false">
                      {{ data?.desc }}
                    </NEllipsis>
                  </div>
                </SkeletonPlaceholder>
              </div>

              <div class="flex gap-2 mt-auto pt-2">
                <NButton round size="small" secondary @click="playCollection">
                  <template #icon>
                    <NIcon size="20">
                      <div class="i-material-symbols:play-arrow-rounded" />
                    </NIcon>
                  </template>
                  播放
                </NButton>
                <NButton round size="small" secondary @click="onAddCollection">
                  <template #icon>
                    <NIcon size="16">
                      <div class="i-material-symbols:add-circle-outline-rounded" />
                    </NIcon>
                  </template>
                  添加
                </NButton>
              </div>
            </div>
          </div>

          <SongTable :data="data?.list ?? []" />
        </template>
      </div>
    </NScrollbar>
  </NSpin>
</template>

<style scoped>
:deep(.n-data-table-tr td:first-child){
  @apply rd-[4px_0_0_4px];
}

:deep(.n-data-table-tr td:last-child){
  @apply rd-[0_4px_4px_0];
}
</style>
