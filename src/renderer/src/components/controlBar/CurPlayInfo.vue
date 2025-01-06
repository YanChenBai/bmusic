<script setup lang="ts">
import { usePlayerStoreRefs } from '@renderer/stores/player'
import { formatSeconds } from '@renderer/utils/formatSeconds'

const { curPlaySong, playerInfo } = usePlayerStoreRefs()

const playTime = computed(() => formatSeconds(playerInfo.value.progress))
const longTime = computed(() => formatSeconds(playerInfo.value.longTime))
</script>

<template>
  <div class="py-4 pl-4 box-border h-80px grid-(~ cols-[48px_1fr]) gap-2.5 select-none overflow-hidden">
    <div class="size-12 flex items-center justify-center">
      <CoverImage size="48px" :src="curPlaySong?.cover" class="aspect-square object-cover rd-1" />
    </div>

    <div class="flex flex-col gap-1 justify-center w-full overflow-hidden">
      <AutoMarquee :key="`${curPlaySong?.bvid}-${curPlaySong?.cid}`">
        <div class="pr-2 whitespace-nowrap">
          {{ curPlaySong?.name ?? '暂无播放捏~' }} <span class="text-#A2A2A3 text-3"> - {{ curPlaySong?.author ?? '无' }}</span>
        </div>
      </AutoMarquee>

      <div class="text-#A2A2A3 text-3">
        {{ playTime }}/{{ longTime }}
      </div>
    </div>
  </div>
</template>
