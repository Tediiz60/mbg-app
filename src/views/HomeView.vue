<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logoMbg from '@/assets/mbg.jpg'

const router = useRouter()

// Status untuk modal popup password master
const showAdminModal = ref(false)
const masterPassword = ref('')
const showPass = ref(false)

const openAdminModal = () => {
  showAdminModal.value = true
  masterPassword.value = ''
}

const verifyMasterPassword = () => {
  // Ganti 'adminpusat2026' dengan password master rahasia pilihan CEO / kamu
  if (masterPassword.value === 'adminpusat2026') {
    showAdminModal.value = false
    router.push('/admin')
  } else {
    alert('Master Password Admin Salah! Akses ditolak.')
  }
}

const goToSiswa = () => {
  router.push('/siswa')
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative">
    
    <!-- MODAL POPUP MASTER PASSWORD ADMIN -->
    <div v-if="showAdminModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
        <div class="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto text-xl border border-cyan-500/30">
          🔐
        </div>
        <div class="space-y-1">
          <h3 class="text-sm font-extrabold text-cyan-400">VERIFIKASI ADMIN PUSAT</h3>
          <p class="text-xs text-slate-400">Masukkan master password untuk mengakses panel admin.</p>
        </div>

        <div class="relative">
          <input 
            v-model="masterPassword" 
            :type="showPass ? 'text' : 'password'" 
            placeholder="Masukkan master password..." 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-12 text-xs focus:outline-none focus:border-cyan-500 text-white" 
            @keyup.enter="verifyMasterPassword"
          />
          <button 
            type="button" 
            @click="showPass = !showPass" 
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 text-[10px] font-bold px-1 py-1 cursor-pointer select-none"
          >
            {{ showPass ? '🙈' : '👁️' }}
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <button 
            @click="showAdminModal = false"
            class="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition border border-slate-700"
          >
            Batal
          </button>
          <button 
            @click="verifyMasterPassword"
            class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition shadow-lg"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>

    <!-- HALAMAN UTAMA -->
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
        Selamat datang di pusat informasi dan pengelolaan menu harian program makan bergizi. Silakan pilih akses di bawah ini:
      </p>

      <!-- Tombol Pilihan Menu Utama -->
      <div class="space-y-3 pt-2">
        <button 
          @click="openAdminModal"
          class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm cursor-pointer transition shadow-lg flex items-center justify-center space-x-2"
        >
          <span>🔐 Masuk ke Panel Admin</span>
        </button>

        <button 
          @click="goToSiswa"
          class="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold py-3.5 px-4 rounded-xl text-sm cursor-pointer transition border border-slate-700 flex items-center justify-center space-x-2"
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