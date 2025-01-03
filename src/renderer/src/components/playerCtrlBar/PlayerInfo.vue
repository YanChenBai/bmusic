<script setup lang="ts">
import { usePlayerStoreRefs } from '@renderer/stores/player'

const videoRef = useTemplateRef('videoRef')
const { curPlaySong, playerInfo } = usePlayerStoreRefs()
const { onPlayerState } = usePlayerStore()
const playerCtrl = usePlayerCtrl()
const loading = ref(true)

onMounted(() => {
  const el = videoRef.value
  if (!el)
    return

  el.currentTime = playerInfo.value.progress

  el.addEventListener('timeupdate', () => {
    playerInfo.value.progress = el.currentTime
  })

  el.addEventListener('pause', () => playerInfo.value.state = PlayerStateEnum.PAUSE)
  el.addEventListener('play', () => playerInfo.value.state = PlayerStateEnum.PLAY)

  el.addEventListener('ended', () => {
    playerCtrl.autoNext()
  })

  el.addEventListener('loadstart', () => loading.value = true)
  el.addEventListener('loadeddata', () => loading.value = false)
})

// 播放状态修改
onPlayerState((state) => {
  const el = videoRef.value
  if (!el)
    return

  switch (state) {
    case PlayerStateEnum.PLAY:
      el.play()
      break
    case PlayerStateEnum.PAUSE:
      el.pause()
      break
    default:
      break
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
  <div class="py-4 pl-4 box-border h-80px grid-(~ cols-[48px_1fr]) gap-3 select-none">
    <div class="size-12 flex items-center justify-center">
      <video v-show="!loading" ref="videoRef" autoplay class="w-12 aspect-square object-cover rd-1 z-1" />
      <CoverImage v-show="loading" size="48px" :src="curPlaySong?.cover" class="aspect-square object-cover rd-1" />
    </div>
    <div class="flex flex-col gap-1">
      <TextAutoMarquee :key="`${curPlaySong?.bvid}-${curPlaySong?.cid}`" :content="curPlaySong?.name ?? '暂无播放捏~'" />
      <div class="text-#A2A2A3 text-3">
        {{ curPlaySong?.author ?? '无' }}
      </div>
    </div>
  </div>
</template>
