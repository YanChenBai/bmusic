<script setup lang="ts">
import { PlayerStateEnum, usePlayerStoreRefs } from '@renderer/stores/player'
import { useSongSwitcher } from '@renderer/utils/songSwitcher'

const { playerStateToggle } = usePlayerStore()
const { playerInfo } = usePlayerStoreRefs()
const { next, prev } = useSongSwitcher()
</script>

<template>
  <div class="flex box-border px15 w-full select-none justify-center pos-relative">
    <div class="flex gap-2 items-center">
      <NButton quaternary circle @click="() => prev()">
        <template #icon>
          <NIcon :size="28">
            <div class="i-material-symbols:skip-previous-rounded" />
          </NIcon>
        </template>
      </NButton>
      <NButton circle type="primary" @click="() => playerStateToggle()">
        <template #icon>
          <NIcon :size="28">
            <div v-if="playerInfo.state === PlayerStateEnum.PLAY" class="i-material-symbols:pause-rounded" />
            <div v-else class="i-material-symbols:play-arrow-rounded" />
          </NIcon>
        </template>
      </NButton>
      <NButton quaternary circle @click="() => next()">
        <template #icon>
          <NIcon :size="28">
            <div class="i-material-symbols:skip-next-rounded" />
          </NIcon>
        </template>
      </NButton>
    </div>
  </div>
</template>

<style scoped>

</style>
