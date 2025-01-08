<script setup lang="ts">
import SongTable from '@renderer/components/songTable'

defineOptions({ name: 'FavoriteView' })

const { favorites } = useDB()
</script>

<template>
  <div>
    <NScrollbar class="h-[calc(100vh-80px-60px)]">
      <div class="box-border p4">
        <NH2 class="color-#FF6699 select-none font-900 mb-2">
          <NIcon size="24">
            <div class="i-material-symbols:favorite-rounded mt1" />
          </NIcon>
          喜欢
        </NH2>
        <SongTable :data="favorites" />
      </div>
    </NScrollbar>
  </div>
</template>
