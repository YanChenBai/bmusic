<script setup lang="ts">
const { playerInfo } = usePlayerStoreRefs()
const options = [
  {
    label: '顺序播放',
    value: PlayerModeEnum.LINEAR,
  },
  {
    label: '列表循环',
    value: PlayerModeEnum.LIST_LOOP,
  },
  {
    label: '随机播放',
    value: PlayerModeEnum.RANDOM,
  },
  {
    label: '单曲循环',
    value: PlayerModeEnum.SINGLE_LOOP,
  },
]

const curModelTitle = computed(() => options.find(item => item.value === playerInfo.value.mode)?.label)
</script>

<template>
  <n-popselect v-model:value="playerInfo.mode" :options="options" trigger="click">
    <n-button>{{ curModelTitle }}</n-button>
  </n-popselect>
</template>

<style scoped>

</style>
