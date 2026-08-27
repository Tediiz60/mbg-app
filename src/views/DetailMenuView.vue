<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import logoMbg from '../assets/mbg.jpg'
import logoYayasan from '../assets/yayasan.jpeg'

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

// Pemetaan Link Instagram Lengkap untuk Masing-Masing Cabang
const mappingInstagram: Record<string, string> = {
  'kutawaringin-jatisari': 'https://instagram.com/sppgjatisari_kutawaringin',
  'soreang-soreang-3': 'https://instagram.com/sppg_bandung_soreang3',
  'katapang-gandasari-2': 'https://www.instagram.com/sppg.bandunggandasari02',
  'kuningan-kadugede-2': 'https://www.instagram.com/sppgpatra_kadugede',
  'jalaksana-maniskidul': 'https://www.instagram.com/sppgpatra.maniskidul'
}

// Pemetaan Link TikTok Resmi Berdasarkan Cabang
const mappingTiktok: Record<string, string> = {
  'kutawaringin-jatisari': 'https://www.tiktok.com/@sppg_jatisari',
  'soreang-soreang-3': 'https://www.tiktok.com/@sppgbandungsoreang3',
  'katapang-gandasari-2': 'https://www.tiktok.com/@sppg.gandasari.02',
  'kuningan-kadugede-2': 'https://www.tiktok.com/@sppgpatra_kadugede',
  'jalaksana-maniskidul': 'https://www.tiktok.com/@sppg.jalaksana',
  'cihampelas-mekarmukti-2': 'https://www.tiktok.com/@sppg.cihampelas'
}

const cabangMenu = ref(mappingCabang[slug] || 'SPPG Cabang')
const imageUrl = ref('')
const isLoading = ref(true)

// Cek apakah cabang saat ini memiliki link Instagram / TikTok
const instagramUrl = computed(() => {
  return mappingInstagram[slug] || ''
})

const tiktokUrl = computed(() => {
  return mappingTiktok[slug] || ''
})

// Pengecekan cabang Cihampelas (logo yayasan disembunyikan khusus cihampelas)
const isNotCihampelas = computed(() => {
  return slug !== 'cihampelas-mekarmukti-2'
})

// Format Tanggal Hari Ini secara Otomatis dalam Bahasa Indonesia
const tanggalHariIni = computed(() => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date().toLocaleDateString('id-ID', options)
})

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
  <div class="bg-slate-950 text-white min-h-screen w-full py-8 px-4 flex flex-col items-center justify-start overflow-y-auto [-webkit-overflow-scrolling:touch]">
    
    <!-- Kontainer Utama -->
    <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 mb-20 pb-44 relative">
      
      <!-- TOMBOL SOSIAL MEDIA (TIKTOK & INSTAGRAM) DI POJOK KANAN ATAS -->
      <div class="absolute top-5 right-5 flex items-center gap-2">
        
        <!-- Ikon TikTok -->
        <a 
          v-if="tiktokUrl"
          :href="tiktokUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-2.5 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          title="Kunjungi TikTok Resmi Cabang"
        >
          <!-- Ikon SVG TikTok -->
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </a>

        <!-- Ikon Instagram -->
        <a 
          v-if="instagramUrl"
          :href="instagramUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white p-2.5 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          title="Kunjungi Instagram Resmi Cabang"
        >
          <!-- Ikon SVG Instagram -->
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>

      </div>

      <!-- Logo & Header Cabang -->
      <div class="flex flex-col items-center text-center border-b border-slate-800 pb-5 space-y-3">
        
        <!-- BAGIAN DUA LOGO BERBENTUK BULAT -->
        <div class="flex items-center justify-center gap-3">
          <!-- Logo MBG Utama -->
          <img :src="logoMbg" alt="Logo Badan Gizi Nasional" class="w-20 h-20 object-contain drop-shadow-md rounded-full bg-white p-1 border border-slate-700 shadow-lg" />
          
          <!-- Logo Yayasan Patra (Bentuk Bulat, KECUALI Cihampelas) -->
          <img v-if="isNotCihampelas" :src="logoYayasan" alt="Logo Yayasan Patra Nusantara Sakti" class="w-20 h-20 object-cover drop-shadow-md rounded-full bg-slate-900 border-2 border-amber-500/70 shadow-amber-500/20 shadow-lg" />
        </div>

        <div>
          <h1 class="text-xl font-bold text-cyan-400">{{ cabangMenu }}</h1>
          <p class="text-xs text-slate-400">Portal Verifikasi Menu Resmi</p>
        </div>

        <!-- KOTAK TANGGAL OTOMATIS -->
        <div class="bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs px-4 py-1.5 rounded-full flex items-center gap-2 font-bold shadow-sm">
          <span>📅</span> 
          <span>Menu Harian: {{ tanggalHariIni }}</span>
        </div>

        <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Terverifikasi
        </div>
      </div>

      <!-- Kotak Poster Makanan -->
      <div class="bg-slate-950 p-2 sm:p-4 rounded-2xl border border-slate-800 w-full flex flex-col items-center justify-center">
        <div v-if="isLoading" class="text-sm text-cyan-400 flex items-center gap-2 py-12">
          <svg class="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memuat poster...
        </div>
        <img v-else-if="imageUrl" :src="imageUrl" alt="Poster Menu" class="w-full h-auto rounded-xl object-contain shadow-md" />
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