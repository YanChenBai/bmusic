<script setup lang="ts">
</script>

<template>
  <div class="w-full h-full bg-#171718 overflow-hidden">
    <NScrollbar class="h-full">
      <div class="p2">
        <div
          class="grid-(~ cols-[32px_1fr]) gap-2 grid-items-center  rd-2 transition cursor-pointer hover select-none mb-2"
          :class="{
            selected: $route.name === 'favorite',
          }"
          @click="$router.push({
            name: 'favorite',
          })"
        >
          <div class="flex items-center justify-center size-32px rd-2 pt-0.5 box-border">
            <NIcon size="20">
              <div class="i-material-symbols:favorite-rounded" />
            </NIcon>
          </div>

          <NText>
            喜欢
          </NText>
        </div>

        <MyCollections />
      </div>
    </NScrollbar>
  </div>
</template>

<style scoped>
.selected {
  @apply 'bg-#282829'
}
.hover {
  @apply 'hover:bg-#282829'
}
</style>
