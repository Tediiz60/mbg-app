<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'
import logoBgn from '@/assets/sppg.webp'

const cabangMenu = ref('SPPG')
const imageUrl = ref('')
const isLoading = ref(true)
const tanggal = ref('')

const fetchDetailMenu = async () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)

  if (data && data.length > 0) {
    cabangMenu.value = data[0].cabang
    imageUrl.value = data[0].image_url
  } else {
    cabangMenu.value = 'SPPG Sleman Timur'
    imageUrl.value = ''
  }
  isLoading.value = false
}

onMounted(() => {
  fetchDetailMenu()

  const channel = supabase
    .channel('public:menu')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, () => {
      fetchDetailMenu()
    })
    .subscribe()

  onUnmounted(() => {
    supabase.removeChannel(channel)
  })
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex justify-center items-center relative overflow-y-auto">
    
    <!-- Background Glow Ornaments -->
    <div class="absolute -top-32 -left-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl text-center space-y-6 relative z-10 my-6">
      
      <!-- Header SPPG -->
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800/80 text-left">
        <div class="relative">
          <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"></div>
          <img :src="logoBgn" alt="Logo SPPG" class="w-12 h-12 object-contain relative z-10" />
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">{{ cabangMenu }}</h1>
          <p class="text-[10px] tracking-wide text-slate-400 font-medium">Verifikasi Menu MBG Resmi & Analisa Gizi</p>
        </div>
      </div>

      <div class="space-y-1">
        <h2 class="text-xl font-bold text-slate-100 tracking-tight">Poster Menu & Kandungan Gizi</h2>
        <div class="inline-block px-3 py-1 bg-slate-800/60 border border-slate-700/50 rounded-full text-xs text-cyan-300 font-medium shadow-inner">
          📅 {{ tanggal }}
        </div>
      </div>

      <!-- Area Poster (Bisa di-scroll & dilihat detail) -->
      <div class="bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80 flex justify-center items-center min-h-[300px] relative overflow-hidden shadow-inner">
        <div v-if="isLoading" class="absolute inset-0 bg-slate-900 animate-pulse flex flex-col items-center justify-center space-y-3">
          <div class="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-xs text-slate-400 font-medium tracking-wide">Memuat poster terbaru...</span>
        </div>
        
        <img 
          v-else-if="imageUrl" 
          :src="imageUrl" 
          alt="Poster Menu Makanan" 
          class="w-full rounded-xl shadow-lg object-contain max-h-[70vh]" 
        />
        
        <div v-else class="h-60 flex items-center justify-center text-xs text-slate-500 italic">
          Belum ada poster menu yang di-publish oleh admin.
        </div>
      </div>

      <p class="text-xs text-slate-400 italic bg-slate-950/40 py-2.5 px-4 rounded-xl border border-slate-800/50">
        ✨ Poster di atas mencakup informasi menu, porsi, jadwal distribusi, dan tabel analisa gizi resmi.
      </p>

    </div>
  </div>
</template>