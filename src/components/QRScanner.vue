<template>
  <div class="p-6 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl text-white w-full text-center">
    <div class="flex items-center justify-between mb-6 border-b border-slate-700 pb-3">
      <h3 class="text-base font-bold text-sky-400 uppercase tracking-wider">QR Code Menu Hari Ini</h3>
      <span class="bg-sky-500/20 text-sky-400 text-xs font-bold px-3 py-1 rounded-full">Siswa Portal</span>
    </div>

    <div v-if="currentMenu && currentMenu.title" class="flex flex-col items-center justify-center space-y-4 py-2">
      <div class="p-6 bg-white rounded-2xl shadow-xl border border-slate-200">
        <img :src="qrApiUrl" alt="QR Code Menu" class="w-64 h-64 mx-auto" />
      </div>

      <div class="mt-2 space-y-1">
        <h4 class="text-xl font-extrabold text-sky-300">{{ currentMenu.title }}</h4>
        <p class="text-xs text-slate-400 font-mono">{{ currentMenu.date }}</p>
        <p class="text-xs text-emerald-400 font-semibold mt-2">📱 Scan QR Code di atas menggunakan HP untuk melihat detail gizi & foto!</p>
      </div>
    </div>

    <div v-else class="py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
      <p class="text-sm font-semibold text-slate-400">Belum ada menu yang di-publish oleh Admin hari ini.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface MenuData {
  title: string;
  info: string;
  img?: string;
  date: string;
}

const currentMenu = ref<MenuData | null>(null);

const loadMenu = () => {
  const saved = localStorage.getItem('mbg_current_menu');
  if (saved) {
    try {
      currentMenu.value = JSON.parse(saved);
    } catch (e) {
      currentMenu.value = null;
    }
  }
};

const qrApiUrl = computed(() => {
  if (!currentMenu.value) return '';
  
  // Menggunakan IP Network aktif agar HP membaca server yang sama
  const baseUrl = `${window.location.protocol}//${window.location.host}/detail`;
  
  const params = new URLSearchParams({
    t: currentMenu.value.title || '',
    i: currentMenu.value.info || '',
    d: currentMenu.value.date || ''
  }).toString();

  const targetUrl = `${baseUrl}?${params}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;
});

onMounted(() => {
  loadMenu();
  window.addEventListener('mbg-menu-updated', loadMenu);
  window.addEventListener('storage', loadMenu);
});

onUnmounted(() => {
  window.removeEventListener('mbg-menu-updated', loadMenu);
  window.removeEventListener('storage', loadMenu);
});
</script>