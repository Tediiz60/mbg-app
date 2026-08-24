<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: string
  size?: number
}>()

// Menggunakan API QR code publik yang dijamin langsung render gambar secara instan
const qrImageUrl = computed(() => {
  if (!props.value) return ''
  const size = props.size || 180
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(props.value)}`
})
</script>

<template>
  <div class="flex justify-center items-center bg-white p-3 rounded-2xl shadow-xl inline-block">
    <img 
      v-if="value" 
      :src="qrImageUrl" 
      alt="QR Code Menu MBG" 
      class="block rounded-lg"
      :width="size || 180"
      :height="size || 180"
    />
  </div>
</template>