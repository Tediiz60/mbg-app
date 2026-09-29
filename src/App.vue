<template>
  <div class="app-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
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

.app-layout {
  width: 100%;
  min-height: 100vh;
  background-color: #020617;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
}
</style>