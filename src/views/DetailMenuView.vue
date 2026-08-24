<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'
import logoBgn from '@/assets/sppg.webp'

const namaMenu = ref('')
const nutrisiMenu = ref('')
const imageUrl = ref('')
const isLoading = ref(true) // Status loading agar tidak ada lompatan visual
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

  // Realtime subscription agar langsung update instan
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
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-6">
      
      <!-- Header SPPG -->
      <div class="flex items-center space-x-3 pb-3 border-b border-slate-800 text-left">
        <img :src="logoBgn" alt="Logo SPPG" class="w-11 h-11 object-contain" />
        <div>
          <h1 class="text-lg font-extrabold text-cyan-400">SPPG SLEMAN TIMUR</h1>
          <p class="text-[10px] text-slate-400">Verifikasi Menu MBG Resmi</p>
        </div>
      </div>

      <div class="space-y-1">
        <h2 class="text-xl font-bold text-cyan-400">Detail Gizi & Makanan</h2>
        <p class="text-xs text-slate-400">{{ tanggal }}</p>
      </div>

      <!-- Area Foto dengan State Loading yang Mulus -->
      <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-center items-center min-h-[224px]">
        <div v-if="isLoading" class="text-xs text-slate-500 animate-pulse flex flex-col items-center space-y-2">
          <div class="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Memuat data menu terbaru...</span>
        </div>
        <img v-else-if="imageUrl" :src="imageUrl" alt="Menu Makanan" class="w-full h-56 object-cover rounded-lg shadow-md transition-opacity duration-300" />
        <div v-else class="h-56 flex items-center justify-center text-xs text-slate-500">
          Belum ada foto menu yang di-publish.
        </div>
      </div>

      <!-- Nama Menu -->
      <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-left space-y-1">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Nama Menu</p>
        <p class="text-base font-bold text-cyan-400 capitalize">{{ isLoading ? 'Memuat...' : namaMenu }}</p>
      </div>

      <!-- Nutrisi -->
      <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-left space-y-1">
        <p class="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Kandungan Nutrisi & Gizi</p>
        <p class="text-sm text-slate-200 whitespace-pre-line">{{ isLoading ? 'Memuat...' : nutrisiMenu }}</p>
      </div>

    </div>
  </div>
</template>