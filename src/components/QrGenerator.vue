<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

defineProps<{
  value: string
  size?: number
}>()
</script>

<template>
  <div class="flex justify-center items-center bg-white p-3 rounded-2xl shadow-xl inline-block">
    <QrcodeVue 
      v-if="value"
      :value="value" 
      :size="size || 180" 
      level="M"
      render-as="svg"
    />
  </div>
</template>