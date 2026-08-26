<script setup lang="ts">
import { useRouter } from 'vue-router'
import logoMbg from '@/assets/mbg.jpg'

const router = useRouter()

const goToSiswa = () => {
  router.push('/siswa')
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
    
    <!-- HEADER / NAVBAR RESMI -->
    <header class="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <!-- Logo & Nama Instansi -->
        <div class="flex items-center space-x-3">
          <img :src="logoMbg" alt="Logo MBG" class="w-11 h-11 object-contain rounded-full bg-white p-0.5 border border-cyan-500/40 shadow-md" />
          <div>
            <h1 class="text-xs sm:text-sm font-extrabold text-white tracking-wide">BADAN GIZI NASIONAL</h1>
            <p class="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Republik Indonesia • SPPG Program</p>
          </div>
        </div>

        <!-- Tombol Aksi Cepat di Header -->
        <button 
          @click="goToSiswa"
          class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center space-x-1.5"
        >
          <span>📱 Portal Siswa & Menu</span>
        </button>

      </div>
    </header>

    <!-- KONTEN UTAMA (HERO SECTION) -->
    <main class="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      
      <!-- Efek Cahaya Background Estetik -->
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-4xl w-full mx-auto text-center space-y-8 relative z-10">
        
        <!-- Badge Status Resmi -->
        <div class="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded-full shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[11px] font-bold text-slate-300 tracking-wide uppercase">Sistem Pengelolaan Menu & Pemenuhan Gizi</span>
        </div>

        <!-- Judul Utama -->
        <div class="space-y-4">
          <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Mewujudkan Generasi <span class="text-cyan-400 underline decoration-cyan-500/40 underline-offset-8">Sehat & Berkualitas</span> Menuju Indonesia Emas
          </h2>
          <p class="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Portal resmi monitoring menu harian, distribusi, dan transparansi program Makan Bergizi (MBG) terpusat untuk seluruh satuan pelayanan pemenuhan gizi di daerah.
          </p>
        </div>

        <!-- Tombol Interaktif Utama -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            @click="goToSiswa"
            class="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm px-8 py-4 rounded-2xl transition shadow-xl shadow-cyan-500/20 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Buka Portal Siswa & Cek Menu Harian</span>
            <span>→</span>
          </button>
        </div>

        <!-- Kotak Informasi Singkat Cabang (Grid Fitur Ala BGN) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 text-left">
          <div class="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-2 backdrop-blur-sm">
            <div class="text-cyan-400 text-xl font-bold">🛡️</div>
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">Standar Mutu Gizi</h3>
            <p class="text-[11px] text-slate-400 leading-relaxed">Pengawasan ketat kalori dan gizi seimbang harian untuk siswa di setiap cabang.</p>
          </div>

          <div class="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-2 backdrop-blur-sm">
            <div class="text-cyan-400 text-xl font-bold">📊</div>
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">Transparansi Publik</h3>
            <p class="text-[11px] text-slate-400 leading-relaxed">Akses informasi menu terbuka yang dapat dipantau langsung oleh orang tua dan siswa.</p>
          </div>

          <div class="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-2 backdrop-blur-sm">
            <div class="text-cyan-400 text-xl font-bold">🌐</div>
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">Multi Cabang SPPG</h3>
            <p class="text-[11px] text-slate-400 leading-relaxed">Terintegrasi langsung dengan sistem manajemen pengelola cabang di berbagai wilayah.</p>
          </div>
        </div>

      </div>
    </main>

    <!-- FOOTER RESMI -->
    <footer class="w-full bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-1">
      <p class="font-bold text-slate-400">Badan Gizi Nasional Republik Indonesia</p>
      <p>&copy; 2026 SPPG Portal Management System. All rights reserved.</p>
    </footer>

  </div>
</template>