<script setup lang="ts">
import type { PlaylistSong } from '@renderer/stores/player'

const props = defineProps<{
  song: PlaylistSong
}>()

const { pushPlaylist } = usePlayerStore()

function onClick() {
  pushPlaylist(props.song)
}
</script>

<template>
  <div>
    <NButton circle quaternary @click.stop="onClick">
      <template #icon>
        <NIcon size="22">
          <div class="i-material-symbols:add-circle-outline-rounded" />
        </NIcon>
      </template>
    </NButton>
  </div>
</template>
