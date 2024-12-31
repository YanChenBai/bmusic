<script setup lang="ts">
const [active, toggle] = useToggle(false)
const { playlist, delPlaylist } = usePlayer()
</script>

<template>
  <div class="m-l-a pr-7 text-#A5A5A5">
    <NBadge :value="playlist.length">
      <NButton quaternary @click="() => toggle()">
        <template #icon>
          <NIcon size="32">
            <div class="i-material-symbols:playlist-play-rounded" />
          </NIcon>
        </template>
      </NButton>
    </NBadge>

    <NDrawer v-model:show="active" :width="360" placement="right">
      <NDrawerContent>
        <template #header>
          <div class="h-27px flex items-center text-4">
            播放列表
          </div>
        </template>

        <NScrollbar class="px3 box-border">
          <div v-if="playlist.length" class="grid">
            <div v-for="item in playlist" :key="`${item.bvid}-${item.cid}`" class="flex items-center gap-2 bg pos-relative group">
              <CoverImage :src="item.cover" size="36px" />
              <div class="flex flex-col leading-2 justify-center gap-2">
                <div>{{ item.name }}</div>
                <div class="text-(3 #A5A5A5)">
                  {{ item.author }}
                </div>
              </div>
              <div class="pos-absolute right-2 group-hover:block hidden">
                <NButton circle quaternary @click="() => delPlaylist(item)">
                  <template #icon>
                    <NIcon>
                      <div class="i-material-symbols:delete-rounded" />
                    </NIcon>
                  </template>
                </NButton>
              </div>
            </div>
          </div>
          <n-result v-else class="mt-10" status="404" title="歌单是空的哦~" description="找点对胃口的歌吧~" />
        </NScrollbar>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped>
.bg {
  @apply rd-1 p2
}
.bg:nth-child(2n) {
  @apply bg-#000/10;
}
</style>
