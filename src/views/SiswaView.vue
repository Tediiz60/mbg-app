<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QrGenerator from '../components/QrGenerator.vue'

const qrValue = ref('')
const namaMenu = ref('Belum Ada Menu')
const tanggal = ref('')

const updateQrData = () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  const savedData = localStorage.getItem('mbg_menu')
  if (savedData) {
    const data = JSON.parse(savedData)
    namaMenu.value = data.nama || 'Belum Ada Menu'
    
    // Kirim data nama dan nutrisi lewat URL Query
    const params = new URLSearchParams({
      nama: data.nama || '',
      nutrisi: data.nutrisi || '',
      image: data.image || ''
    })
    
    qrValue.value = `${window.location.origin}/detail?${params.toString()}`
  } else {
    qrValue.value = `${window.location.origin}/detail`
  }
}

onMounted(() => {
  updateQrData()
  
  // Update otomatis jika admin klik Publish Menu di tab lain
  window.addEventListener('storage', updateQrData)
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
    <div class="text-center mb-6">
      <h1 class="text-3xl font-extrabold text-cyan-400">SCAN MENU MBG</h1>
      <p class="text-slate-400 text-sm mt-1">Makan Bergizi Gratis - Informasi Nutrisi Harian</p>
    </div>

    <div class="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full text-center space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">QR Code Menu Hari Ini</h2>
        <span class="bg-cyan-950 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-800">Siswa Portal</span>
      </div>

      <div class="bg-white p-4 rounded-xl flex justify-center items-center shadow-inner">
        <QrGenerator v-if="qrValue" :value="qrValue" :size="240" />
      </div>

      <div class="space-y-1">
        <p class="text-lg font-bold text-cyan-400 capitalize">{{ namaMenu }}</p>
        <p class="text-xs text-slate-400">{{ tanggal }}</p>
      </div>

      <p class="text-xs text-slate-500 italic">
        📱 Scan QR Code di atas menggunakan HP untuk melihat detail gizi & foto.
      </p>
    </div>
  </div>
</template>