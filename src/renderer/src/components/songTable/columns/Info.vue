<script setup lang="ts">
import type { PlaylistSong } from '@renderer/stores/player'
import { NEllipsis } from 'naive-ui'

defineProps<{ song: PlaylistSong }>()
const { isCurPlaySong } = usePlayerStore()
</script>

<template>
  <div class="grid-(~ cols-[42px_1fr]) gap-2 overflow-hidden">
    <IsPlayingCoverImage :song="song" size="42px" />

    <div class="flex flex-col justify-center">
      <div
        class="text-sm w-80"
        :class="{
          'text-#FF6699': isCurPlaySong(song),
        }"
      >
        <NEllipsis>{{ song.name }}</NEllipsis>
      </div>
      <div class="text-(sm #A2A2A3)">
        {{ song.author }}
      </div>
    </div>
  </div>
</template>
