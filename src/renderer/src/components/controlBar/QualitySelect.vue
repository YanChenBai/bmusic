<script setup lang="ts">
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
  playQuality.value.map(({ id, url }) => {
    return {
      id,
      label: LABELS[id],
      value: url,
    }
  }).sort((a, b) => SORT_INDEX[b.id] - SORT_INDEX[a.id]),
)

const curQualityTitle = computed(() => options.value.find(item => item.value === playerInfo.value.url)?.label)
</script>

<template>
  <NPopselect v-model:value="playerInfo.url" :options="options" trigger="click">
    <NButton size="small">
      {{ curQualityTitle }}
    </NButton>
  </NPopselect>
</template>
