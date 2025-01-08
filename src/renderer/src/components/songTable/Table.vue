<script setup lang="ts">
import type { PlaylistSong } from '@renderer/types/playlist'
import type { DataTableColumns } from 'naive-ui'
import type { HTMLAttributes } from 'vue'
import CtrlCol from './columns/Ctrl.vue'
import InfoCol from './columns/Info.vue'

defineProps<{
  data: PlaylistSong[]
}>()

const { setPlaySong } = usePlayerStore()

const columns: DataTableColumns<PlaylistSong> = [
  {
    key: 'name',
    title: '歌名/歌手',
    render(rowData) {
      return h(InfoCol, { song: rowData })
    },
  },
  {
    key: 'part',
    render(rowData) {
      return h(CtrlCol, {
        song: rowData,
      })
    },
  },
  {
    key: 'lengthTime',
    title: '时长',
    render(rowData) {
      return formatSeconds(rowData.longTime)
    },
  },
]

function rowProps(song: PlaylistSong) {
  return {
    onDblclick: () => setPlaySong(song),
  } as HTMLAttributes
}
</script>

<template>
  <NConfigProvider
    abstract
    :theme-overrides="{
      DataTable: {
        thColor: 'rgba(0,0,0,0)',
        tdColor: 'rgba(0,0,0,0)',
        tdColorHover: '#2f2f33',
      },
    }"
  >
    <NDataTable
      class="select-none"
      :bordered="false"
      :columns="columns"
      :data="data" striped
      :bottom-bordered="false"
      :single-column="true"
      :row-props="rowProps"
    />
  </NConfigProvider>
</template>
