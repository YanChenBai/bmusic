<script setup lang="ts">
const { playerInfo } = usePlayerStoreRefs()
const options = [
  {
    label: '顺序播放',
    value: PlayerModeEnum.SEQUENTIAL,
  },
  {
    label: '列表循环',
    value: PlayerModeEnum.REPEAT_ALL,
  },
  {
    label: '随机播放',
    value: PlayerModeEnum.SHUFFLE,
  },
  {
    label: '单曲循环',
    value: PlayerModeEnum.REPEAT_ONE,
  },
]

const curModelTitle = computed(() => options.find(item => item.value === playerInfo.value.mode)?.label)
</script>

<template>
  <NPopselect v-model:value="playerInfo.mode" :options="options" trigger="click">
    <NButton>{{ curModelTitle }}</NButton>
  </NPopselect>
</template>

<style scoped>

</style>
