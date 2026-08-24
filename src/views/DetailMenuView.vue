<script setup lang="ts">
import { ref, onMounted } from 'vue'

const menu = ref({
  nama: 'Memuat Menu...',
  nutrisi: 'Memuat kandungan gizi...',
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
})
const tanggal = ref('')

onMounted(() => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  const savedData = localStorage.getItem('mbg_menu')
  if (savedData) {
    const data = JSON.parse(savedData)
    menu.value = {
      nama: data.nama || 'Menu Hari Ini',
      nutrisi: data.nutrisi || 'Informasi gizi belum tersedia.',
      image: data.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    }
  } else {
    menu.value = {
      nama: 'Belum Ada Menu',
      nutrisi: 'Admin belum mempublish menu makanan hari ini.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      
      <div class="text-center">
        <span class="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          Verifikasi Menu MBG Resmi
        </span>
        <h1 class="text-lg font-bold mt-2 text-cyan-400">Detail Gizi & Makanan</h1>
        <p class="text-xs text-slate-400">{{ tanggal }}</p>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-800 h-48 bg-slate-950 shadow-inner">
        <img :src="menu.image" alt="Foto Makanan" class="w-full h-full object-cover" />
      </div>

      <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
        <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nama Menu</p>
        <p class="text-base font-bold text-cyan-400 capitalize">{{ menu.nama }}</p>
      </div>

      <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
        <p class="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Kandungan Nutrisi & Gizi</p>
        <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ menu.nutrisi }}</p>
      </div>

    </div>
  </div>
</template>