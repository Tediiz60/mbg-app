<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const route = useRoute()
const slug = (route.params.slug as string) || 'sukahaji'

const mappingCabang: Record<string, string> = {
  'sleman-timur': 'SPPG Sleman Timur',
  'djati-pasundan': 'SPPG Djati Pasundan',
  'cihampelas': 'SPPG Cihampelas',
  'katapang': 'SPPG Katapang',
  'sukahaji': 'SPPG Sukahaji',
  'bandung-berkah': 'SPPG Bandung Berkah'
}

const cabangMenu = ref(mappingCabang[slug] || 'SPPG Sukahaji')
const imageUrl = ref('')
const isLoading = ref(true)
const errorMessage = ref('')
const tanggal = ref(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))

const fetchDetailMenu = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .eq('cabang', cabangMenu.value)
      .order('id', { ascending: false })
      .limit(1)

    if (error) {
      throw error
    }

    if (data && data.length > 0) {
      imageUrl.value = data[0].image_url
    } else {
      imageUrl.value = ''
    }
  } catch (err: any) {
    console.error('Error:', err.message)
    errorMessage.value = 'Gagal memuat data: ' + err.message
  } finally {
    isLoading.value = false
  }
}

let channel: any = null

onMounted(() => {
  fetchDetailMenu()
  try {
    channel = supabase
      .channel(`public:menu:${cabangMenu.value}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, () => {
        fetchDetailMenu()
      })
      .subscribe()
  } catch (e) {
    console.error('Realtime error:', e)
  }
})

onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex justify-center items-center">
    <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-6">
      
      <!-- Header -->
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800 text-left">
        <div class="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 font-bold text-lg">
          🏫
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-cyan-400">{{ cabangMenu }}</h1>
          <p class="text-[10px] tracking-wide text-slate-400 font-medium">Verifikasi Menu MBG Resmi & Analisa Gizi</p>
        </div>
      </div>

      <div class="space-y-1">
        <h2 class="text-xl font-bold text-slate-100 tracking-tight">Poster Menu & Kandungan Gizi</h2>
        <div class="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-cyan-300 font-medium">
          📅 {{ tanggal }}
        </div>
      </div>

      <!-- Area Gambar / Poster -->
      <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-center items-center min-h-[300px]">
        <div v-if="isLoading" class="text-xs text-cyan-400 animate-pulse">
          Memuat poster terbaru...
        </div>
        
        <div v-else-if="errorMessage" class="text-xs text-red-400 p-4">
          {{ errorMessage }}
        </div>

        <img 
          v-else-if="imageUrl" 
          :src="imageUrl" 
          alt="Poster Menu Makanan" 
          class="w-full rounded-xl shadow-lg object-contain max-h-[70vh]" 
        />
        
        <div v-else class="text-xs text-slate-400 italic p-4">
          Belum ada poster menu yang di-publish untuk cabang <span class="text-cyan-400 font-bold">{{ cabangMenu }}</span>. Silakan upload melalui portal admin.
        </div>
      </div>

      <p class="text-xs text-slate-400 italic bg-slate-950/40 py-2.5 px-4 rounded-xl border border-slate-800">
        ✨ Halaman ini terhubung secara real-time dengan database.
      </p>

    </div>
  </div>
</template>