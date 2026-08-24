<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

defineProps<{
  value: string
  size?: number
}>()
</script>

<template>
  <div class="flex justify-center items-center bg-white p-2 rounded-xl shadow">
    <QrcodeVue 
      :value="value" 
      :size="size || 180" 
      level="H"
      render-as="svg"
    />
  </div>
</template>