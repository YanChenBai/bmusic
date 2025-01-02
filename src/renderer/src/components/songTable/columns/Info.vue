<script setup lang="ts">
import CoverImage from '@renderer/components/CoverImage.vue'
import { NEllipsis } from 'naive-ui'

defineProps<{
  name: string
  author: string
  cover?: string
}>()
</script>

<template>
  <div class="grid-(~ cols-[42px_1fr]) gap-2">
    <CoverImage :src="cover" size="42px" />
    <div class="flex flex-col justify-center">
      <div class="text-sm max-w-90">
        <NEllipsis>{{ name }}</NEllipsis>
      </div>
      <div class="text-(sm #A2A2A3)">
        {{ author }}
      </div>
    </div>
  </div>
</template>
