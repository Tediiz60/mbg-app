<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QrGenerator from '../components/QrGenerator.vue'
import { supabase } from '../lib/supabase'
import logoMbg from '@/assets/mbg.jpg'

const qrValue = ref('')
const hasMenu = ref(false)
const namaMenu = ref('Memuat...')
const tanggal = ref('')
const isLoading = ref(true)

const fetchLatestMenu = async () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  const { data, error } = await supabase
    .from('menu')
    .select('*')

  if (error) {
    console.error('Error fetching menu:', error.message)
    hasMenu.value = false
    isLoading.value = false
    return
  }

  if (data && data.length > 0) {
    const latest = data[data.length - 1]
    hasMenu.value = true
    namaMenu.value = latest.nama
    qrValue.value = `${window.location.origin}/detail`
  } else {
    hasMenu.value = false
    namaMenu.value = 'Belum Ada Menu'
    qrValue.value = ''
  }
  isLoading.value = false
}

onMounted(() => {
  fetchLatestMenu()
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center relative overflow-hidden">
    
    <!-- Background Glow Ornaments -->
    <div class="absolute -top-32 -left-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl text-center space-y-6 relative z-10 transition-all duration-300 hover:border-slate-700">
      
      <!-- Header SPPG / Badan Gizi Nasional -->
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800/80 text-left">
        <div class="relative">
          <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"></div>
          <img :src="logoMbg" alt="Logo MBG" class="w-12 h-12 object-contain relative z-10 rounded-full" />
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">PORTAL MENU MBG</h1>
          <p class="text-[10px] tracking-wide text-slate-400 font-medium">Badan Gizi Nasional - Republik Indonesia</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-slate-950/80 p-12 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center space-y-3">
        <div class="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs text-slate-400 font-medium">Memuat sistem...</span>
      </div>

      <!-- Belum Ada Menu -->
      <div v-else-if="!hasMenu" class="bg-slate-950/80 p-8 rounded-2xl border border-slate-800/80 space-y-3 shadow-inner">
        <div class="text-3xl animate-bounce">⏳</div>
        <p class="text-sm font-semibold text-amber-400">Admin Belum Mempublish Menu</p>
        <p class="text-xs text-slate-400 leading-relaxed">
          QR Code dan informasi menu makanan akan otomatis muncul setelah admin mengupload foto dan rincian menu.
        </p>
      </div>

      <!-- Menu Aktif & QR Code -->
      <div v-else class="space-y-4">
        <div class="bg-slate-950/90 p-6 rounded-2xl border border-slate-800/80 flex justify-center items-center shadow-inner group">
          <div class="bg-white p-3 rounded-2xl shadow-xl inline-block transition-transform duration-300 group-hover:scale-105">
            <QrGenerator :value="qrValue" :size="180" />
          </div>
        </div>

        <div class="bg-gradient-to-br from-slate-950/90 to-slate-900 p-4 rounded-2xl border border-slate-800/80 space-y-1 text-left shadow-md">
          <p class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1">
            <span>🟢</span> <span>Menu Makanan Aktif</span>
          </p>
          <p class="text-lg font-extrabold text-white capitalize tracking-wide">{{ namaMenu }}</p>
          <p class="text-xs text-slate-400 font-medium">📅 {{ tanggal }}</p>
        </div>

        <p class="text-xs text-slate-400 italic bg-slate-950/40 py-2 px-3 rounded-xl border border-slate-800/50">
          📱 Scan QR Code di atas menggunakan HP siswa untuk melihat detail foto editan & nutrisi gizi makanan.
        </p>
      </div>

    </div>
  </div>
</template>