<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* Reset global agar semua perangkat mendefinisikan scroll secara natural */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-color: #020617;
  overflow-x: hidden;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #020617;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
}
</style>