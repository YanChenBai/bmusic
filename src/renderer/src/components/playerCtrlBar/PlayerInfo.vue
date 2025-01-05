<script setup lang="ts">
import { usePlayerStoreRefs } from '@renderer/stores/player'

const audioRef = useTemplateRef('audioRef')
const { curPlaySong, playerInfo } = usePlayerStoreRefs()
const { onPlayerState, recoverPlaySong, onSetProgress } = usePlayerStore()
const playerCtrl = usePlayerCtrl()

onMounted(() => {
  const el = audioRef.value
  if (!el)
    return

  el.currentTime = playerInfo.value.progress

  el.addEventListener('timeupdate', () => {
    playerInfo.value.progress = el.currentTime
  })

  el.addEventListener('pause', () => playerInfo.value.state = PlayerStateEnum.PAUSE)
  el.addEventListener('play', () => playerInfo.value.state = PlayerStateEnum.PLAY)

  el.addEventListener('ended', () => playerCtrl.autoNext())

  recoverPlaySong()
})

onSetProgress((val) => {
  const el = audioRef.value
  if (!el)
    return

  el.currentTime = val
})

// 播放状态修改
onPlayerState((state) => {
  const el = audioRef.value
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
watch(
  () => playerInfo.value.url,
  (url) => {
    const el = audioRef.value
    if (!el || !url)
      return

    el.src = url
    el.play()
  },
)

/** 监听音量变换且同步 */
watchEffect(() => {
  const el = audioRef.value
  if (!el)
    return

  el.volume = playerInfo.value.volume / 100
})
</script>

<template>
  <div class="py-4 pl-4 box-border h-80px grid-(~ cols-[48px_1fr]) gap-3 select-none">
    <div class="size-12 flex items-center justify-center">
      <!-- <video v-show="!loading" ref="videoRef" autoplay class="w-12 aspect-square object-cover rd-1 z-1" /> -->
      <audio ref="audioRef" autoplay controls class="hidden">
        <source :src="playerInfo.url ?? ''" type="audio/mp4">
      </audio>
      <CoverImage size="48px" :src="curPlaySong?.cover" class="aspect-square object-cover rd-1" />
    </div>

    <div class="flex flex-col gap-1">
      <TextAutoMarquee :key="`${curPlaySong?.bvid}-${curPlaySong?.cid}`" :content="curPlaySong?.name ?? '暂无播放捏~'" />
      <div class="text-#A2A2A3 text-3">
        {{ curPlaySong?.author ?? '无' }}
      </div>
    </div>
  </div>
</template>
