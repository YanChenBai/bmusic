<script setup lang="ts">
import PlayOnceIcon from '@renderer/assets/icons/PlayOnce.svg?raw'
import RepeatAllIcon from '@renderer/assets/icons/RepeatAll.svg?raw'
import RepeatOneIcon from '@renderer/assets/icons/RepeatOne.svg?raw'
import SequentialIcon from '@renderer/assets/icons/Sequential.svg?raw'
import ShuffleIcon from '@renderer/assets/icons/Shuffle.svg?raw'

const { playerInfo } = usePlayerStoreRefs()
const options = [
  {
    label: '顺序播放',
    value: PlayerModeEnum.SEQUENTIAL,
    icon: SequentialIcon,
  },
  {
    label: '列表循环',
    value: PlayerModeEnum.REPEAT_ALL,
    icon: RepeatAllIcon,
  },
  {
    label: '随机播放',
    value: PlayerModeEnum.SHUFFLE,
    icon: ShuffleIcon,
  },
  {
    label: '单曲循环',
    value: PlayerModeEnum.REPEAT_ONE,
    icon: RepeatOneIcon,
  },
  {
    label: '单次播放',
    value: PlayerModeEnum.PLAY_ONCE,
    icon: PlayOnceIcon,
  },
]

const curModelTitle = computed(() => options.find(item => item.value === playerInfo.value.mode)!.label)
const curModelIcon = computed(() => options.find(item => item.value === playerInfo.value.mode)!.icon)
</script>

<template>
  <NTooltip>
    <template #trigger>
      <NPopselect v-model:value="playerInfo.mode" :options="options" trigger="click">
        <NButton text>
          <div class="flex" v-html="curModelIcon" />
        </NButton>
      </NPopselect>
    </template>
    {{ curModelTitle }}
  </NTooltip>
</template>
