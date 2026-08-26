<script setup lang="ts">
import { useRouter } from 'vue-router'
import logoMbg from '@/assets/mbg.jpg'

const router = useRouter()

const goToSiswa = () => {
  router.push('/siswa')
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
      
      <!-- Logo & Judul -->
      <div class="space-y-3">
        <img :src="logoMbg" alt="Logo MBG" class="w-20 h-20 object-contain mx-auto rounded-full shadow-lg border border-cyan-500/30" />
        <div class="space-y-1">
          <h1 class="text-xl font-extrabold text-cyan-400">PORTAL MENU MBG</h1>
          <p class="text-xs text-slate-400">Badan Gizi Nasional - Republik Indonesia</p>
        </div>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed">
        Selamat datang di pusat informasi menu harian program makan bergizi. Silakan klik tombol di bawah ini untuk melihat jadwal menu cabang Anda:
      </p>

      <!-- Tombol Khusus Siswa -->
      <div class="space-y-3 pt-2">
        <button 
          @click="goToSiswa"
          class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm cursor-pointer transition shadow-lg flex items-center justify-center space-x-2"
        >
          <span>📱 Buka Portal Siswa / QR Code</span>
        </button>
      </div>

      <div class="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500">
        SPPG Program Management System &copy; 2026
      </div>

    </div>
  </div>
</template>