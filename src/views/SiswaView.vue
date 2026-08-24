<template>
  <div class="min-h-screen bg-slate-900 text-white p-4 sm:p-8 flex flex-col items-center">
    <div class="text-center my-6">
      <h1 class="text-3xl font-extrabold text-sky-400 tracking-wide">SCAN MENU MBG</h1>
      <p class="text-slate-400 text-sm mt-1">Makan Bergizi Gratis - Informasi Nutrisi Harian</p>
    </div>

    <div class="w-full max-w-4xl">
      <QRScanner />
    </div>
  </div>
</template>

<script setup lang="ts">
import QRScanner from '../components/QRScanner.vue';
</script>