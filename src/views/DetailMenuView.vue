<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'
import logoBgn from '@/assets/sppg.webp'

const namaMenu = ref('')
const nutrisiMenu = ref('')
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
    namaMenu.value = data[0].nama
    nutrisiMenu.value = data[0].nutrisi
    imageUrl.value = data[0].image_url
  } else {
    namaMenu.value = 'Belum Ada Menu'
    nutrisiMenu.value = '-'
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
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center relative overflow-hidden">
    
    <!-- Background Glow Ornaments -->
    <div class="absolute -top-32 -left-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl text-center space-y-6 relative z-10 transition-all duration-300 hover:border-slate-700">
      
      <!-- Header SPPG -->
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800/80 text-left">
        <div class="relative">
          <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"></div>
          <img :src="logoBgn" alt="Logo SPPG" class="w-12 h-12 object-contain relative z-10" />
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">SPPG SLEMAN TIMUR</h1>
          <p class="text-[10px] tracking-wide text-slate-400 font-medium">Verifikasi Menu MBG Resmi</p>
        </div>
      </div>

      <div class="space-y-1">
        <h2 class="text-xl font-bold text-slate-100 tracking-tight">Detail Gizi & Makanan</h2>
        <div class="inline-block px-3 py-1 bg-slate-800/60 border border-slate-700/50 rounded-full text-xs text-cyan-300 font-medium shadow-inner">
          📅 {{ tanggal }}
        </div>
      </div>

      <!-- Area Foto dengan Efek Shimmer & Fade In -->
      <div class="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 flex justify-center items-center min-h-[240px] relative overflow-hidden group shadow-inner">
        <div v-if="isLoading" class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse flex flex-col items-center justify-center space-y-3">
          <div class="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-xs text-slate-400 font-medium tracking-wide">Memuat menu terbaru...</span>
        </div>
        
        <img 
          v-else-if="imageUrl" 
          :src="imageUrl" 
          alt="Menu Makanan" 
          class="w-full h-56 object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]" 
        />
        
        <div v-else class="h-56 flex items-center justify-center text-xs text-slate-500 italic">
          Belum ada foto menu yang di-publish.
        </div>
      </div>

      <!-- Nama Menu Card -->
      <div class="bg-gradient-to-br from-slate-950/90 to-slate-900 p-4 rounded-2xl border border-slate-800/80 text-left space-y-1 shadow-md transition-all duration-300 hover:border-cyan-500/30">
        <p class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1">
          <span>🍽️</span> <span>Nama Menu</span>
        </p>
        <p class="text-lg font-extrabold text-white capitalize tracking-wide">
          {{ isLoading ? 'Memuat...' : namaMenu }}
        </p>
      </div>

      <!-- Kandungan Nutrisi Card -->
      <div class="bg-gradient-to-br from-slate-950/90 to-slate-900 p-4 rounded-2xl border border-slate-800/80 text-left space-y-1 shadow-md transition-all duration-300 hover:border-emerald-500/30">
        <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1">
          <span>🥗</span> <span>Kandungan Nutrisi & Gizi</span>
        </p>
        <p class="text-sm text-slate-200 whitespace-pre-line leading-relaxed font-medium">
          {{ isLoading ? 'Memuat...' : nutrisiMenu }}
        </p>
      </div>

    </div>
  </div>
</template>