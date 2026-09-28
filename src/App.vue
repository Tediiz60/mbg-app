<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style>
/* Reset universal agar seluruh browser HP dan PC mengizinkan scroll natural */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  min-height: 100vh !important;
  background-color: #020617 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
}

#app {
  width: 100% !important;
  min-height: 100vh !important;
  overflow-y: auto !important;
}
</style>