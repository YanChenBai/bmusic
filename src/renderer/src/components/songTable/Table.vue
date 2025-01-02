<script setup lang="ts">
import type { PlaylistSong } from '@renderer/stores/player'
import type { DataTableColumns } from 'naive-ui'
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
      return h(InfoCol, rowData)
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
  let preClickTime = 0
  return {
    onClick: () => {
      if (Date.now() - preClickTime > 200 || preClickTime === 0) {
        preClickTime = Date.now()
        return
      }
      setPlaySong(song)
    },
  }
}
</script>

<template>
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
