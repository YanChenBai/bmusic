<script setup lang="ts">
import { formatSeconds } from '@renderer/utils/formatSeconds'

const progressBar = useTemplateRef('progressBar')
const { setProgress } = usePlayerStore()
const { playerInfo } = usePlayerStoreRefs()
const showPopover = ref(false)
const { height } = useWindowSize()
const hoverTime = ref('00:00')
const x = ref(0)
const y = computed(() => height.value - 80)
const dragProgress = ref(0)
let oldProgress = 0

const displayProgress = computed(() => {
  oldProgress = playerInfo.value.progress / playerInfo.value.longTime * 100

  return oldProgress
})

function getLeft(event: MouseEvent) {
  const el = progressBar.value
  if (!el)
    return 0

  const diff = (event.x - el.offsetLeft)

  return Math.max(0, diff)
}

function getPercentage(event: MouseEvent) {
  const el = progressBar.value
  if (!el)
    return 0

  const offset = 8
  const left = getLeft(event)
  const offsetWidth = el.offsetWidth

  /** 避免点击到边界时失效 */
  if (left <= offset) {
    return 0
  }
  else if (left >= offsetWidth - offset) {
    return 1
  }
  else {
    return Number(((left - offset) / (offsetWidth - offset * 2)).toFixed(4))
  }
}

/** 当鼠标移动时，计算进度 */
function onMove(event: MouseEvent) {
  dragProgress.value = getPercentage(event)

  const el = progressBar.value
  if (!el)
    return

  const left = getLeft(event)
  x.value = left

  hoverTime.value = formatSeconds(getPercentage(event) * playerInfo.value.longTime)
}

/** 跳到指定时间 */
function seek(event: MouseEvent) {
  const el = progressBar.value
  if (!el)
    return

  const progress = getPercentage(event) * playerInfo.value.longTime

  setProgress(progress)
}

function onMouseUp(event: MouseEvent) {
  seek(event)
}
</script>

<template>
  <div
    ref="progressBar" class="h-2.5 w-full cursor-pointer pos-absolute z-4 select-none group"
    @mouseup="onMouseUp"
    @mousemove="onMove"
    @mouseenter="showPopover = true"
    @mouseleave="showPopover = false"
  >
    <NPopover :show="showPopover" :y="y" :x="x" trigger="manual" :to="progressBar!" class="pointer-events-none">
      <span class="select-none">{{ hoverTime }}</span>
    </NPopover>
    <div class=" bg-#2E2E30 h-.5 group-hover:h1 transition-all-100">
      <div class="h-full bg-#FF6699 rd-2 transition-all-100" :style="{ width: `${displayProgress}%` }" />
    </div>
  </div>
</template>

<style scoped>

</style>
