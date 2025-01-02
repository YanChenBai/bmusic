<script setup lang="ts">
import Image from '@renderer/assets/imgs/cover.jpg'
import { usePlayerStoreRefs } from '@renderer/stores/player'

const videoRef = useTemplateRef('videoRef')
const { curPlaySong, playerInfo } = usePlayerStoreRefs()
const { onPlayerState } = usePlayerStore()
const playerCtrl = usePlayerCtrl()

onMounted(() => {
  const el = videoRef.value
  if (!el)
    return

  el.addEventListener('timeupdate', () => {
    playerInfo.value.progress = el.currentTime
  })

  el.addEventListener('pause', () => playerInfo.value.state = PlayerStateEnum.PAUSE)
  el.addEventListener('play', () => playerInfo.value.state = PlayerStateEnum.PLAY)

  el.addEventListener('ended', () => {
    playerCtrl.value.autoNext()
  })

  el.currentTime = playerInfo.value.progress
})

// 播放状态修改
onPlayerState((state) => {
  const el = videoRef.value
  if (!el)
    return

  if (state === PlayerStateEnum.PLAY) {
    el.play()
  }
  else if (state === PlayerStateEnum.PAUSE) {
    el.pause()
  }
})

/** 监听播放地址变化 */
watchEffect(() => {
  const el = videoRef.value
  const url = playerInfo.value.url
  if (!el || !url)
    return

  el.src = url
  el.play()
})

/** 监听音量变换且同步 */
watchEffect(() => {
  const el = videoRef.value
  if (!el)
    return

  el.volume = playerInfo.value.volume / 100
})
</script>

<template>
  <div class="py-4 pl-4 box-border overflow-hidden h-80px overflow-hidden grid-(~ cols-[48px_1fr]) gap-3 select-none">
    <div class="size-12 pos-relative flex items-center justify-center">
      <CoverImage size="48px" :src="curPlaySong?.cover ?? Image" class="size-12 aspect-square object-cover rd-1 pos-absolute left-0 top-0 z-0" />
      <video ref="videoRef" autoplay class="size-12 aspect-square object-cover rd-1 pos-relative z-1" />
    </div>
    <div class="flex flex-col gap-1">
      <TextAutoMarquee :key="`${curPlaySong?.bvid}-${curPlaySong?.cid}`" :content="curPlaySong?.name ?? '暂无播放捏~'" />
      <div class="text-#A2A2A3 text-3">
        {{ curPlaySong?.author ?? '无' }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
