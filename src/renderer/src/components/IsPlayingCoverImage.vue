<script setup lang="ts">
import type { PlaylistSong } from '@renderer/stores/player'

withDefaults(
  defineProps<{
    song: PlaylistSong
    size?: string
  }>(),
  {
    size: '36px',
  },
)
const { isCurPlaySong } = usePlayerStore()
</script>

<template>
  <div class="relative" :style="{ width: size, height: size }">
    <div v-if="isCurPlaySong(song)" class="pos-absolute size-full pointer-events-none flex justify-center items-center rd-1 bg-#000/20">
      <div class="i-svg-spinners:bars-scale-fade size-4 text-#FF6699" />
    </div>
    <CoverImage :src="song.cover" :size="size" />
  </div>
</template>
