<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

defineProps<{
  value: string
  size?: number
}>()
</script>

<template>
  <div class="flex justify-center items-center">
    <QrcodeVue 
      :value="value" 
      :size="size || 200" 
      level="M" 
      render-as="svg" 
      class="max-w-full h-auto rounded-lg"
    />
  </div>
</template>