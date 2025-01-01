<script setup lang="ts">
import { PlayerStateEnum } from '@renderer/stores/player'
import { formatSeconds } from '@renderer/utils/formatSeconds'

const { playerInfo, pause, play } = usePlayer()

const playTime = computed(() => formatSeconds(playerInfo.value.progress))
const longTime = computed(() => formatSeconds(playerInfo.value.longTime))

function playOrPause() {
  if (playerInfo.value.state === PlayerStateEnum.PLAY) {
    pause()
  }
  else {
    play()
  }
}
</script>

<template>
  <div class="flex flex-col items-center box-border px15 pt-3 w-full select-none">
    <div class="flex gap-2 items-center">
      <NButton quaternary circle>
        <template #icon>
          <NIcon :size="26">
            <div class="i-material-symbols:skip-previous-rounded" />
          </NIcon>
        </template>
      </NButton>
      <NButton circle type="primary" class="size-7.5" @click="playOrPause">
        <template #icon>
          <NIcon :size="24">
            <div v-if="playerInfo.state === PlayerStateEnum.PLAY" class="i-material-symbols:pause-rounded" />
            <div v-else class="i-material-symbols:play-arrow-rounded" />
          </NIcon>
        </template>
      </NButton>
      <NButton quaternary circle>
        <template #icon>
          <NIcon :size="26">
            <div class="i-material-symbols:skip-next-rounded" />
          </NIcon>
        </template>
      </NButton>
    </div>
    <div class="flex w-full items-center gap-2">
      <div class="text-3 text-#A2A2A3">
        {{ playTime }}
      </div>
      <div class="h-1 rd-2 w-full bg-white/10 overflow-hidden">
        <div class="h-full bg-white rd-2" :style="{ width: `${playerInfo.progress / playerInfo.longTime * 100}%` }" />
      </div>
      <div class="text-3 text-#A2A2A3">
        {{ longTime }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
