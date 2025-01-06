<script setup lang="ts">
import { usePlayerStoreRefs } from '@renderer/stores/player'
import { useSongSwitcher } from '@renderer/utils/songSwitcher'

const audioRef = useTemplateRef('audioRef')
const { playerInfo } = usePlayerStoreRefs()
const songSwitcher = useSongSwitcher()
const { onPlayerState, recoverPlaySong, onSetProgress } = usePlayerStore()

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

  el.addEventListener('ended', () => songSwitcher.autoNext())

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

watchEffect(() => {
  const el = audioRef.value
  const id = playerInfo.value.deviceId
  if (id && el)
    el.setSinkId(id)
})
</script>

<template>
  <audio ref="audioRef" controls class="hidden">
    <source :src="playerInfo.url ?? ''" type="audio/mp4">
  </audio>
</template>
