<script setup lang="ts">
import type { Song } from '@renderer/types/playlist'
import MusicCollectionCtrl from '@renderer/components/MusicCollectionCtrl.vue'
import SongInfo from '@renderer/components/SongInfo.vue'
import { formatSeconds } from '@renderer/utils/formatSeconds'
import { type DataTableColumns, NConfigProvider, NSpin } from 'naive-ui'

const props = defineProps<{
  bvid: string
}>()

const { playSong, addListToPlaylist } = usePlayer()
const { data, error, isLoading } = useQuery({
  key: () => ['getPlayerData', props.bvid],
  query: () => window.invokes.getPlaylist(props.bvid),
})

const columns: DataTableColumns<Song> = [
  {
    key: 'name',
    title: '歌名/歌手',
    render(rowData) {
      return h(SongInfo, {
        name: rowData.part,
        cover: rowData.first_frame,
        author: data.value?.owner.name ?? '',
      })
    },
  },
  {
    key: 'part',
    render(rowData) {
      return h(MusicCollectionCtrl, {
        song: {
          bvid: props.bvid,
          cid: rowData.cid,
          cover: rowData.first_frame,
          author: data.value?.owner.name ?? '',
          name: rowData.part,
        },
      })
    },
  },
  {
    key: 'lengthTime',
    title: '时长',
    render(rowData) {
      return formatSeconds(rowData.duration)
    },
  },
]

function rowProps(rowData: Song) {
  let preClickTime = 0
  return {
    onClick: () => {
      if (Date.now() - preClickTime > 200 || preClickTime === 0) {
        preClickTime = Date.now()
        return
      }
      playSong({
        bvid: props.bvid,
        cid: rowData.cid,
        cover: rowData.first_frame,
        author: data.value?.owner.name ?? '',
        name: rowData.part,
      })
    },
  }
}

function playCollection() {
  const pages = data.value?.pages
  if (!pages || pages.length === 0)
    return

  const collectionSongs = pages.map((item) => {
    return {
      bvid: props.bvid,
      cid: item.cid,
      cover: item.first_frame,
      author: data.value?.owner.name ?? '',
      name: item.part,
    }
  })
  addListToPlaylist(collectionSongs)
  playSong(collectionSongs[0])
}
</script>

<template>
  <NSpin :show="isLoading">
    <NScrollbar class="h-[calc(100vh-80px-60px)]">
      <div class="p-4 box-border grid gap-4">
        <NResult v-if="error" status="404" title="请求错误" description="生活总归带点荒谬" />
        <template v-else>
          <div class="grid-(~ cols-[128px_1fr]) gap-4">
            <CoverImage size="128px" class="rd-2" :src="data?.pic" />
            <div flex flex-col>
              <div class="flex flex-col gap-1">
                <TextLoadPlaceholder :loading="isLoading" skeleton-class="max-w-360px">
                  <div class="text-xl">
                    {{ data?.title }}
                  </div>
                </TextLoadPlaceholder>

                <div class="flex gap-2">
                  <CoverImage size="16px" class="rd-full" :src="data?.owner.face" />
                  <TextLoadPlaceholder :loading="isLoading" skeleton-class="max-w-300px">
                    <span class="text-(3 #A2A2A3)">{{ data?.owner.name }}</span>
                  </TextLoadPlaceholder>
                </div>

                <TextLoadPlaceholder :loading="isLoading" skeleton-class="max-w-300px" :repeat="2">
                  <div class="text-(3 #A2A2A3)">
                    <NEllipsis class="overflow-hidden whitespace-pre max-w-600px" expand-trigger="click" line-clamp="1" :tooltip="false">
                      {{ data?.desc }}
                    </NEllipsis>
                  </div>
                </TextLoadPlaceholder>
              </div>

              <div class="flex gap-2 mt-auto">
                <NButton round size="small" secondary @click="playCollection">
                  <template #icon>
                    <NIcon size="20">
                      <div class="i-material-symbols:play-arrow-rounded" />
                    </NIcon>
                  </template>
                  播放
                </NButton>
                <!-- <NButton round size="small" secondary>
                  <template #icon>
                    <NIcon size="20">
                      <div class="i-material-symbols:download-rounded" />
                    </NIcon>
                  </template>
                  下载
                </NButton> -->
                <NButton round size="small" secondary>
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

          <NConfigProvider
            abstract
            :theme-overrides="{
              DataTable: {
                thColor: 'rgba(0,0,0,0)',
                tdColor: 'rgba(0,0,0,0)',
                tdColorHover: '#2f2f30',
              },
            }"
          >
            <NDataTable :bordered="false" :columns="columns" :data="data?.pages ?? []" striped :bottom-bordered="false" :single-column="true" :row-props="rowProps" />
          </NConfigProvider>
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
