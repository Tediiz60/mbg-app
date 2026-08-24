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
    
    // QR code diarahkan ke halaman detail dengan membawa parameter data unik agar fresh
    const params = new URLSearchParams({
      t: data.timestamp || Date.now().toString()
    })
    qrValue.value = `${window.location.origin}/detail?${params.toString()}`
  } else {
    qrValue.value = `${window.location.origin}/detail`
  }
}

onMounted(() => {
  loadMenuData()
  // Deteksi perubahan data secara real-time dari tab admin
  window.addEventListener('storage', loadMenuData)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-6">
      
      <div class="flex justify-between items-center">
        <div class="text-left">
          <h1 class="text-xl font-extrabold text-cyan-400">SCAN MENU MBG</h1>
          <p class="text-[11px] text-slate-400">Makan Bergizi Gratis - SMAN/SMK</p>
        </div>
        <router-link to="/admin" class="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-semibold transition">
          Admin Login
        </router-link>
      </div>

      <div class="bg-slate-950 p-6 rounded-xl border border-slate-800 flex justify-center items-center">
        <div class="bg-white p-3 rounded-xl shadow-lg inline-block">
          <QrGenerator v-if="qrValue" :value="qrValue" :size="180" />
        </div>
      </div>

      <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
        <p class="text-xs font-semibold text-slate-400 uppercase">Menu Makanan Hari Ini</p>
        <p class="text-lg font-bold text-cyan-400 capitalize">{{ namaMenu }}</p>
        <p class="text-xs text-slate-500">{{ tanggal }}</p>
      </div>

      <p class="text-xs text-slate-500 italic">
        📱 Scan QR Code di atas menggunakan kamera HP siswa untuk melihat detail foto & nutrisi gizi makanan.
      </p>

    </div>
  </div>
</template>