<script setup lang="ts">
import { ref, onMounted } from 'vue'

const menu = ref({
  nama: 'Belum Ada Menu',
  nutrisi: 'Belum ada detail nutrisi yang dimasukkan admin.',
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
})

const tanggal = ref('')

onMounted(() => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  // Baca parameter nama & nutrisi dari QR Code
  const urlParams = new URLSearchParams(window.location.search)
  const namaParam = urlParams.get('nama')
  const nutrisiParam = urlParams.get('nutrisi')

  if (namaParam || nutrisiParam) {
    menu.value.nama = namaParam || menu.value.nama
    menu.value.nutrisi = nutrisiParam || menu.value.nutrisi
  } else {
    // Fallback jika diakses dari laptop yang sama
    const savedData = localStorage.getItem('mbg_menu')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      menu.value = {
        nama: parsed.nama || menu.value.nama,
        nutrisi: parsed.nutrisi || menu.value.nutrisi,
        image: parsed.image || menu.value.image
      }
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      <div class="text-center">
        <span class="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          Verifikasi Menu MBG
        </span>
        <h1 class="text-xl font-bold mt-3 text-cyan-400">Detail Menu & Nutrisi</h1>
        <p class="text-xs text-slate-400 mt-1">{{ tanggal }}</p>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-800 h-52 bg-slate-950">
        <img :src="menu.image" alt="Foto Menu" class="w-full h-full object-cover" />
      </div>

      <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
        <p class="text-xs font-semibold text-slate-400">NAMA MENU</p>
        <p class="text-lg font-bold text-cyan-400 capitalize">{{ menu.nama }}</p>
      </div>

      <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
        <p class="text-xs font-semibold text-emerald-400">KANDUNGAN NUTRISI & GIZI</p>
        <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ menu.nutrisi }}</p>
      </div>

    </div>
  </div>
</template>