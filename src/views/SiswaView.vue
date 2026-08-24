<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QrGenerator from '../components/QrGenerator.vue'

const qrValue = ref('')
const namaMenu = ref('Belum Ada Menu')
const tanggal = ref('')

const loadMenuData = () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  const savedData = localStorage.getItem('mbg_menu')
  if (savedData) {
    const data = JSON.parse(savedData)
    namaMenu.value = data.nama || 'Menu Baru'
    
    // Masukkan data teks ke dalam parameter URL agar langsung terbaca di HP saat discan
    const queryData = encodeURIComponent(JSON.stringify({
      n: data.nama,
      u: data.nutrisi,
      i: data.image
    }))
    qrValue.value = `${window.location.origin}/detail?payload=${queryData}`
  } else {
    qrValue.value = `${window.location.origin}/detail`
  }
}

onMounted(() => {
  loadMenuData()
  window.addEventListener('storage', loadMenuData)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-6">
      
      <!-- Header bersih tanpa tombol login admin -->
      <div class="text-left pb-2 border-b border-slate-800">
        <h1 class="text-xl font-extrabold text-cyan-400">SCAN MENU MBG</h1>
        <p class="text-[11px] text-slate-400">Makan Bergizi Gratis - SMAN/SMK</p>
      </div>

      <div class="bg-slate-950 p-6 rounded-xl border border-slate-800 flex justify-center items-center">
        <div class="bg-white p-3 rounded-xl shadow-lg inline-block">
          <QrGenerator v-if="qrValue" :value="qrValue" :size="180" />
        </div>
      </div>

      <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
        <p class="text-xs font-semibold text-slate-400 uppercase">Menu Makanan Terbaru</p>
        <p class="text-lg font-bold text-cyan-400 capitalize">{{ namaMenu }}</p>
        <p class="text-xs text-slate-500">{{ tanggal }}</p>
      </div>

      <p class="text-xs text-slate-500 italic">
        📱 Scan QR Code di atas menggunakan HP siswa untuk melihat detail foto & nutrisi gizi makanan.
      </p>

    </div>
  </div>
</template>