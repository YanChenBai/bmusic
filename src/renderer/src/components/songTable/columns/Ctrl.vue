<script setup lang="ts">
import type { PlaylistSong } from '@renderer/types/playlist'
import { usePlaylistStore } from '@renderer/stores/playlist'

const props = defineProps<{
  song: PlaylistSong
}>()

const playlistStore = usePlaylistStore()

function onClick() {
  playlistStore.push(props.song)
}

const has = computed(() => playlistStore.has(props.song.bvid, props.song.cid))
</script>

<template>
  <div>
    <NButton circle quaternary :disabled="has" @click.stop="onClick">
      <template #icon>
        <NIcon size="22">
          <div class="i-material-symbols:add-circle-outline-rounded" />
        </NIcon>
      </template>
    </NButton>
  </div>
</template>
