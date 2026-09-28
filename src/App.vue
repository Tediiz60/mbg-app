<template>
  <div id="app-wrapper">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* Reset total agar body dan root mengizinkan scroll secara global ke bawah */
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

#app-wrapper {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-y: visible !important;
  background-color: #020617;
  color: #ffffff;
}
</style>