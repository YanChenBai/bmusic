<script setup lang="ts">
import SongTable from '@renderer/components/songTable'

defineOptions({ name: 'FavoriteView' })

const { favorites } = useDB()
const playlistStore = usePlaylistStore()
const { setPlaySong } = usePlayerStore()

function play() {
  if (favorites.value.length === 0)
    return

  playlistStore.push(favorites.value)
  setPlaySong(favorites.value[0])
}
</script>

<template>
  <div>
    <NScrollbar class="h-[calc(100vh-80px-60px)]">
      <div class="box-border p4">
        <div class="flex gap4 items-center mb-2">
          <NH2 class="color-#FF6699 select-none font-900 mb-0">
            <NIcon size="24">
              <div class="i-material-symbols:favorite-rounded mt1" />
            </NIcon>
            喜欢
          </NH2>

          <NButton round size="small" secondary @click="play">
            <template #icon>
              <NIcon size="20">
                <div class="i-material-symbols:play-arrow-rounded" />
              </NIcon>
            </template>
            播放
          </NButton>
        </div>
        <SongTable :data="favorites" />
      </div>
    </NScrollbar>
  </div>
</template>
