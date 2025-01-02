<script setup lang="ts">
</script>

<template>
  <div class="size-full border-(0 t-1px solid #2E2E30) box-border grid-(~ cols-[280px_1fr_280px])">
    <PlayerInfo />
    <PlayerCtrl />
    <div class="size-full items-center flex justify-end gap-3">
      <PlayerMode />
      <PlayerVolume />
      <PlayList />
    </div>
  </div>
</template>

<style scoped>

</style>
