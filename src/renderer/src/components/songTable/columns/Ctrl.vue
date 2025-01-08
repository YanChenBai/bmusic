<script setup lang="ts">
import type { PlaylistSong } from '@renderer/types/playlist'
import { usePlaylistStore } from '@renderer/stores/playlist'

const props = defineProps<{
  song: PlaylistSong
}>()

const playlistStore = usePlaylistStore()
const db = useDB()

const hasPlaylist = computed(() => playlistStore.has(props.song.bvid, props.song.cid))
const hasFavorite = computed(() => db.hasFavorite(props.song.bvid, props.song.cid))

function onAddPlaylistClick() {
  playlistStore.push(props.song)
}

function onFavoriteClick() {
  if (hasFavorite.value) {
    db.removeFavorite(props.song)
  }
  else {
    db.addFavorite(props.song)
  }
}
</script>

<template>
  <div class="flex gap-2">
    <NButton text :type="hasFavorite ? 'primary' : undefined" @click.stop="onFavoriteClick">
      <template #icon>
        <NIcon size="22">
          <div v-if="hasFavorite" class="i-material-symbols:favorite-rounded" />
          <div v-else class="i-material-symbols:favorite-outline-rounded" />
        </NIcon>
      </template>
    </NButton>

    <NButton text :disabled="hasPlaylist" @click.stop="onAddPlaylistClick">
      <template #icon>
        <NIcon size="22">
          <div class="i-material-symbols:add-circle-outline-rounded" />
        </NIcon>
      </template>
    </NButton>
  </div>
</template>
