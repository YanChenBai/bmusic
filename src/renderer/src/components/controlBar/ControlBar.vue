<script setup lang="ts">
</script>

<template>
  <div>
    <ProgressBar />
    <div class="size-full grid-(~ cols-[280px_1fr_280px])">
      <CurPlayInfo />
      <ControlBtns />
      <div class="size-full items-center flex justify-end gap-2">
        <SectionSelect />
        <QualitySelect />
        <PlayMode />
        <VolumeControl />
        <PlayList />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
