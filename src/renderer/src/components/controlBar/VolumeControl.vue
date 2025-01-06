<script setup lang="ts">
import { usePlayerStoreRefs } from '@renderer/stores/player'

const { playerInfo } = usePlayerStoreRefs()
const { modifyVolume } = usePlayerStore()

function handleWheel(payload: WheelEvent) {
  const delta = payload.deltaY > 0 ? -1 : 1
  modifyVolume(playerInfo.value.volume + delta)
}
</script>

<template>
  <NTooltip>
    <template #trigger>
      <NPopover :show-arrow="false" trigger="click">
        <template #trigger>
          <NButton text class="px-2">
            <template #icon>
              <NIcon size="22">
                <div v-if="playerInfo.volume === 0" class="i-material-symbols:volume-mute-rounded" />
                <div v-else class="i-material-symbols:volume-up-rounded" />
              </NIcon>
            </template>
          </NButton>
        </template>
        <div class="h-50 w-7 grid-(~ rows-[1fr_20px]) gap-2 select-none text-center" @wheel="handleWheel">
          <NSlider v-model:value="playerInfo.volume" :tooltip="false" vertical class="m-a" />
          <NText>{{ playerInfo.volume }}</NText>
        </div>
      </NPopover>
    </template>
    <NText>{{ playerInfo.volume }}</NText>
  </NTooltip>
</template>
