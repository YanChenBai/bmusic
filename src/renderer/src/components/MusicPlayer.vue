<script setup lang="ts">
import { onJumpProgress, onPlayerState, onQualityChange, onSongChange, usePlayerStoreRefs } from '@renderer/stores/player'
import { useSongSwitcher } from '@renderer/utils/songSwitcher'

const audioRef = useTemplateRef('audioRef')
const { playerInfo, curPlaySong } = usePlayerStoreRefs()
const songSwitcher = useSongSwitcher()
const { recoverPlaySong, updateProgress, playerStateToggle } = usePlayerStore()

onMounted(() => {
  const el = audioRef.value
  if (!el)
    return

  el.currentTime = playerInfo.value.progress

  recoverPlaySong()

  el.addEventListener('timeupdate', () => updateProgress(el.currentTime))

  el.addEventListener('pause', () => playerStateToggle(PlayerStateEnum.PAUSE))
  el.addEventListener('play', () => playerStateToggle(PlayerStateEnum.PLAY))

  el.addEventListener('ended', () => songSwitcher.autoNext())
})

onJumpProgress((val) => {
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

function modifyAudioUrl(url: string, time?: number) {
  const el = audioRef.value
  if (!el)
    return

  el.src = url

  if (time)
    el.currentTime = time

  el.play()
}

/** 监听播放地址变化 */
onSongChange(() => {
  const url = playerInfo.value.url
  if (url)
    modifyAudioUrl(url)
})

onQualityChange((quality) => {
  const url = quality.url
  if (url)
    modifyAudioUrl(url, playerInfo.value.progress)
})

/** 监听音量变换且同步 */
watchEffect(() => {
  const el = audioRef.value
  if (!el)
    return

  el.volume = playerInfo.value.volume / 100
})

/** 输出设备切换 */
watchEffect(() => {
  const el = audioRef.value
  const id = playerInfo.value.deviceId
  if (id && el)
    el.setSinkId(id)
})

/** 切换win正在播放的媒体数据 */
watchEffect(() => {
  const song = toValue(curPlaySong)
  if (!song)
    return

  const metadata = new MediaMetadata({
    title: song.name,
    artist: song.author,
    artwork: [{ src: song.cover }],
  })

  navigator.mediaSession.metadata = metadata
})

/** 监听win的播放上一首下一首事件 */
navigator.mediaSession.setActionHandler('previoustrack', () => songSwitcher.prev())
navigator.mediaSession.setActionHandler('nexttrack', () => songSwitcher.next())
</script>

<template>
  <audio ref="audioRef" controls class="hidden">
    <source :src="playerInfo.url ?? ''" type="audio/mp4">
  </audio>
</template>
