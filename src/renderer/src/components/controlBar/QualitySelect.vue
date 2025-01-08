<script setup lang="ts">
import { qualityChangeTrigger } from '@renderer/stores/player'

const { playQuality, playerInfo } = usePlayerStoreRefs()

const LABELS = {
  30216: '64K',
  30232: '132K',
  30280: '192K',
  30250: '杜比',
  30251: '无损',
}

const SORT_INDEX = {
  30216: 1,
  30232: 2,
  30280: 3,
  30250: 4,
  30251: 5,
}

const options = computed(() =>
  playQuality.value.map(({ id }) => {
    return {
      label: LABELS[id],
      value: id,
    }
  }).sort((a, b) => SORT_INDEX[b.value] - SORT_INDEX[a.value]),
)

const curQualityTitle = computed(() => options.value.find(item => item.value === playerInfo.value.quality)?.label ?? '无')

function onChange() {
  const quality = playQuality.value.find(item => item.id === playerInfo.value.quality)
  if (quality)
    qualityChangeTrigger(quality)
}
</script>

<template>
  <NTooltip>
    <template #trigger>
      <NPopselect v-model:value="playerInfo.quality" :options="options" trigger="click" @update-value="onChange">
        <NTag size="small" class="px2 py2.5 text-3 rd-2 cursor-pointer mr-2 select-none">
          {{ curQualityTitle }}
        </NTag>
      </NPopselect>
    </template>
    播放质量
  </NTooltip>
</template>
