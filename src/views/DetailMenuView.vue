<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import logoMbg from '../assets/mbg.jpg'

const route = useRoute()
const slug = (route.params.slug as string) || 'kutawaringin-jatisari'

const mappingCabang: Record<string, string> = {
  'kutawaringin-jatisari': 'SPPG Bandung Kutawaringin Jatisari',
  'soreang-soreang-3': 'SPPG Bandung Soreang Soreang 3',
  'katapang-gandasari-2': 'SPPG Bandung Katapang Gandasari 2',
  'kuningan-kadugede-2': 'SPPG Kuningan Kadugede Kadugede 2',
  'jalaksana-maniskidul': 'SPPG Kuningan Jalaksana Maniskidul',
  'cihampelas-mekarmukti-2': 'SPPG Bandung Barat Cihampelas Mekarmukti 2'
}

const cabangMenu = ref(mappingCabang[slug] || 'SPPG Cabang')
const imageUrl = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('menu')
      .select('*')
      .eq('cabang', cabangMenu.value)
      .order('id', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      imageUrl.value = data[0].image_url
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="bg-slate-950 text-white min-h-full w-full py-12 px-4 flex flex-col items-center justify-start overflow-y-auto [-webkit-overflow-scrolling:touch]">
    <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 pb-24">
      
      <!-- Logo & Header Cabang -->
      <div class="flex flex-col items-center text-center border-b border-slate-800 pb-5 space-y-3">
        <img :src="logoMbg" alt="Logo Badan Gizi Nasional" class="w-20 h-20 object-contain drop-shadow-md rounded-full bg-white p-1" />
        <div>
          <h1 class="text-xl font-bold text-cyan-400">{{ cabangMenu }}</h1>
          <p class="text-xs text-slate-400">Portal Verifikasi Menu Resmi</p>
        </div>
        <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Terverifikasi
        </div>
      </div>

      <!-- Kotak Poster Makanan -->
      <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 min-h-[300px] flex items-center justify-center relative overflow-hidden">
        <div v-if="isLoading" class="text-sm text-cyan-400 flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memuat poster...
        </div>
        <img v-else-if="imageUrl" :src="imageUrl" alt="Poster Menu" class="w-full rounded-xl object-contain shadow-md" />
        <div v-else class="text-sm text-slate-500 italic py-8">Belum ada poster menu aktif untuk cabang ini.</div>
      </div>

      <!-- Tambahan Footer/Pesan Gizi -->
      <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-1">
        <p class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <span>🛡️</span> Standar Gizi & Kebersihan Terjamin
        </p>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          Menu harian ini telah dikurasi dan disesuaikan untuk memenuhi kebutuhan gizi seimbang siswa secara higienis dan tepat waktu.
        </p>
      </div>

      <div class="text-[10px] text-slate-600 text-center pt-1 pb-2">
        SPPG System &copy; 2026 &bull; All Rights Reserved
      </div>

    </div>
  </div>
</template>