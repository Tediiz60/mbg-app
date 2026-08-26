<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import logoMbg from '@/assets/mbg.jpg'

const router = useRouter()

// --- KODE KEAMANAN MASTER ADMIN ---
const isMasterAuthenticated = ref(false)
const masterPasswordInput = ref('')
const showMasterPassword = ref(false)
const MASTER_KEY = 'bgn-pusat-2026' // Ganti password master pusat sesukamu di sini!

// State untuk Modal Alert Umum (Pengganti alert bawaan browser)
const showAlertModal = ref(false)
const alertTitle = ref('')
const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')

const triggerAlert = (title: string, message: string, type: 'success' | 'error') => {
  alertTitle.value = title
  alertMessage.value = message
  alertType.value = type
  showAlertModal.value = true
}

const handleMasterLogin = () => {
  if (masterPasswordInput.value === MASTER_KEY) {
    isMasterAuthenticated.value = true
    triggerAlert('AKSES DITERIMA! 🎉', 'Selamat datang di Panel Utama Pengawas Badan Gizi Nasional.', 'success')
  } else {
    triggerAlert('AKSES DITOLAK! ❌', 'Master Password yang Anda masukkan salah. Periksa kembali!', 'error')
    masterPasswordInput.value = ''
  }
}
// ---------------------------------

interface Cabang {
  nama: string
  slug: string
  password: string
}

const daftarCabang: Cabang[] = [
  { nama: 'SPPG Bandung Kutawaringin Jatisari', slug: 'kutawaringin-jatisari', password: 'sppg05' },
  { nama: 'SPPG Bandung Soreang Soreang 3', slug: 'soreang-soreang-3', password: 'sppg23' },
  { nama: 'SPPG Bandung Katapang Gandasari 2', slug: 'katapang-gandasari-2', password: 'sppg26' },
  { nama: 'SPPG Kuningan Kadugede Kadugede 2', slug: 'kuningan-kadugede-2', password: 'sppg02' },
  { nama: 'SPPG Kuningan Jalaksana Maniskidul', slug: 'jalaksana-maniskidul', password: 'sppg05_' },
  { nama: 'SPPG Bandung Barat Cihampelas Mekarmukti 2', slug: 'cihampelas-mekarmukti-2', password: 'sppg17' }
]

const isLoggedIn = ref(false)
const inputCabangNama = ref('SPPG Bandung Kutawaringin Jatisari')
const inputPassword = ref('')
const showPassword = ref(false)
const activeCabang = ref<Cabang>(daftarCabang[0]!)

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const isUploading = ref(false)
const hasPublished = ref(false)

const salamWaktu = computed(() => {
  const jam = new Date().getHours()
  if (jam < 11) return 'Selamat Pagi 🌅'
  if (jam < 15) return 'Selamat Siang ☀️'
  if (jam < 18) return 'Selamat Sore 🌇'
  return 'Selamat Malam 🌙'
})

const qrCodeUrl = computed(() => {
  const targetUrl = `https://portal-sppg-id.vercel.app/detail/${activeCabang.value.slug}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(targetUrl)}`
})

const handleLogin = () => {
  const found = daftarCabang.find(c => c.nama === inputCabangNama.value)
  if (found && found.password === inputPassword.value) {
    isLoggedIn.value = true
    activeCabang.value = found
    inputPassword.value = ''
    showPassword.value = false
    hasPublished.value = false
    triggerAlert('LOGIN CABANG BERHASIL! ✨', `Berhasil masuk ke sesi pengelola ${found.nama}`, 'success')
  } else {
    triggerAlert('GAGAL MASUK! ⚠️', 'Password cabang yang Anda masukkan salah.', 'error')
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  previewUrl.value = ''
  hasPublished.value = false
  if (fileInput.value) fileInput.value.value = ''
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    previewUrl.value = URL.createObjectURL(target.files[0])
  }
}

const handlePublish = async () => {
  if (!fileInput.value?.files?.[0]) {
    triggerAlert('PERHATIAN! 📌', 'Silakan pilih file foto poster terlebih dahulu.', 'error')
    return
  }

  isUploading.value = true
  const file = fileInput.value.files[0]
  const fileName = `${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (uploadError) {
    triggerAlert('GAGAL UPLOAD! ❌', uploadError.message, 'error')
    isUploading.value = false
    return
  }

  const { data: publicUrlData } = supabase.storage
    .from('menu-images')
    .getPublicUrl(fileName)

  const { error: insertError } = await supabase
    .from('menu')
    .insert([
      {
        cabang: activeCabang.value.nama,
        image_url: publicUrlData.publicUrl
      }
    ])

  isUploading.value = false

  if (insertError) {
    triggerAlert('GAGAL PUBLISH! ❌', insertError.message, 'error')
  } else {
    triggerAlert('BERHASIL DIPUBLISH! 🎉', `Poster menu harian untuk ${activeCabang.value.nama} berhasil disiarkan!`, 'success')
    hasPublished.value = true
    previewUrl.value = ''
    if (fileInput.value) fileInput.value.value = ''
  }
}

const goToStudentView = () => {
  router.push(`/detail/${activeCabang.value.slug}`)
}

const resetUpload = () => {
  hasPublished.value = false
  previewUrl.value = ''
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-hidden">
    
    <!-- Efek Cahaya Background -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <!-- MODAL ALERT CUSTOM (PENGGANTI ALERT BAWAAN BROWSER) -->
    <div v-if="showAlertModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-slate-900 border rounded-3xl p-6 text-center space-y-4 shadow-2xl" :class="alertType === 'success' ? 'border-cyan-500/40' : 'border-red-500/40'">
        
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl border shadow-inner" :class="alertType === 'success' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'">
          {{ alertType === 'success' ? '✨' : '⚠️' }}
        </div>

        <div class="space-y-1">
          <h3 class="text-base font-extrabold tracking-wide" :class="alertType === 'success' ? 'text-cyan-400' : 'text-red-400'">{{ alertTitle }}</h3>
          <p class="text-xs text-slate-300 leading-relaxed">{{ alertMessage }}</p>
        </div>

        <button 
          @click="showAlertModal = false"
          class="w-full font-extrabold py-3 rounded-xl text-xs cursor-pointer transition shadow-lg"
          :class="alertType === 'success' ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950' : 'bg-red-500 hover:bg-red-400 text-white'"
        >
          MENGERTI / LANJUTKAN
        </button>
      </div>
    </div>

    <!-- HEADER / NAVBAR RESMI -->
    <header class="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img :src="logoMbg" alt="Logo MBG" class="w-11 h-11 object-contain rounded-full bg-white p-0.5 border border-cyan-500/40 shadow-md" />
          <div>
            <h1 class="text-xs sm:text-sm font-extrabold text-white tracking-wide">BADAN GIZI NASIONAL</h1>
            <p class="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Portal Manajemen Admin Pusat</p>
          </div>
        </div>
        <div v-if="isLoggedIn" class="flex items-center space-x-2">
          <button @click="handleLogout" class="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition border border-red-500/30">
            Keluar Sesi
          </button>
        </div>
      </div>
    </header>

    <!-- KONTEN UTAMA -->
    <main class="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
      <div class="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 shadow-2xl space-y-6">
        
        <!-- TAHAP 1: FORM MASTER PASSWORD PUSAT -->
        <div v-if="!isMasterAuthenticated" class="space-y-5">
          <div class="space-y-1 text-center pb-2 border-b border-slate-800">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse mb-1"></span>
            <h2 class="text-sm font-extrabold text-white tracking-wide">VERIFIKASI MASTER ADMIN</h2>
            <p class="text-[11px] text-slate-400">Masukkan Master Password tingkat pusat untuk membuka sistem.</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[11px] font-bold text-slate-300">Master Key / Password Pusat</label>
            <div class="relative">
              <input 
                v-model="masterPasswordInput" 
                :type="showMasterPassword ? 'text' : 'password'" 
                placeholder="Masukkan master password..." 
                class="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 pr-12 text-xs focus:outline-none focus:border-cyan-500 transition text-white" 
                @keyup.enter="handleMasterLogin" 
              />
              <button 
                type="button" 
                @click="showMasterPassword = !showMasterPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 text-xs font-bold px-1 py-1 cursor-pointer select-none"
              >
                {{ showMasterPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <p class="text-[10px] text-slate-500 italic text-center">
            💡 Hint (untuk uji coba): Password master saat ini adalah <code class="text-cyan-400 font-mono">bgn-pusat-2026</code>
          </p>

          <button @click="handleMasterLogin" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs cursor-pointer transition shadow-lg shadow-cyan-500/20">
            BUKA PANEL UTAMA 🔓
          </button>
        </div>

        <!-- TAHAP 2: SETELAH MASTER PASSWORD BENAR -> LOGIN CABANG -->
        <div v-else>
          
          <!-- FORM LOGIN CABANG -->
          <div v-if="!isLoggedIn" class="space-y-5">
            <div class="space-y-1 text-center pb-2 border-b border-slate-800">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse mb-1"></span>
              <h2 class="text-sm font-extrabold text-white tracking-wide">PILIH CABANG SPPG</h2>
              <p class="text-[11px] text-slate-400">Pilih wilayah cabang dan masukkan password operasionalnya.</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-[11px] font-bold text-slate-300">Wilayah Cabang</label>
              <select v-model="inputCabangNama" class="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-cyan-500 transition">
                <option v-for="c in daftarCabang" :key="c.slug" :value="c.nama">{{ c.nama }}</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-[11px] font-bold text-slate-300">Password Cabang</label>
              <div class="relative">
                <input 
                  v-model="inputPassword" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="Masukkan password cabang..." 
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 pr-12 text-xs focus:outline-none focus:border-cyan-500 transition text-white" 
                  @keyup.enter="handleLogin" 
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 text-xs font-bold px-1 py-1 cursor-pointer select-none"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <button @click="handleLogin" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs cursor-pointer transition shadow-lg shadow-cyan-500/20">
              MASUK SESI CABANG 🚀
            </button>
          </div>

          <!-- SETELAH LOGIN CABANG BERHASIL -->
          <div v-else class="space-y-5">
            <!-- SALAM HANGAT -->
            <div class="bg-gradient-to-r from-cyan-950/60 to-slate-900 p-4 rounded-2xl border border-cyan-800/50 space-y-1">
              <p class="text-[11px] font-extrabold text-cyan-300 tracking-wide">{{ salamWaktu }}, Admin!</p>
              <p class="text-xs font-bold text-white leading-snug">{{ activeCabang.nama }}</p>
            </div>

            <!-- FORM UPLOAD -->
            <div v-if="!hasPublished" class="space-y-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div class="space-y-1">
                <label class="block text-xs font-bold text-emerald-400">📤 Update Poster Menu Harian</label>
                <p class="text-[10px] text-slate-400">Unggah poster menu gizi terbaru untuk dipublikasikan ke portal siswa.</p>
              </div>

              <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-xl p-2.5 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400" />

              <div v-if="previewUrl">
                <img :src="previewUrl" alt="Preview" class="w-full max-h-52 object-contain rounded-xl border border-slate-800 shadow-md" />
              </div>

              <button @click="handlePublish" :disabled="isUploading" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs cursor-pointer disabled:opacity-50 transition shadow-lg shadow-cyan-500/20">
                {{ isUploading ? 'SEDANG MENGUNGGAH...' : 'PUBLISH POSTER SEKARANG ✨' }}
              </button>
            </div>

            <!-- TAMPILAN QR CODE -->
            <div v-else class="bg-slate-900/60 p-5 rounded-2xl border border-cyan-500/40 text-center space-y-4">
              <div class="space-y-1">
                <p class="text-xs font-extrabold text-emerald-400">🎉 Poster Berhasil Dipublikasikan!</p>
                <p class="text-[11px] text-slate-400">Gunakan QR Code di bawah untuk akses cepat siswa:</p>
              </div>
              
              <div class="bg-white p-3.5 rounded-2xl inline-block shadow-xl border border-cyan-500/20">
                <img 
                  :src="qrCodeUrl" 
                  alt="QR Code Cabang" 
                  class="w-38 h-38 mx-auto object-contain"
                />
              </div>
              
              <div class="text-[11px] text-cyan-300 font-mono bg-slate-950 py-1.5 px-3 rounded-lg border border-slate-800 truncate">
                /detail/{{ activeCabang.slug }}
              </div>
              
              <div class="space-y-2 pt-1">
                <button 
                  @click="goToStudentView"
                  class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs cursor-pointer transition shadow-md flex items-center justify-center space-x-2"
                >
                  <span>👀 Lihat Tampilan Menu Siswa</span>
                </button>

                <button 
                  @click="resetUpload"
                  class="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer transition border border-slate-700"
                >
                  🔄 Upload Poster Baru (Ganti Menu)
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>

    <!-- FOOTER RESMI -->
    <footer class="w-full bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-1 relative z-10">
      <p class="font-bold text-slate-400">Badan Gizi Nasional Republik Indonesia</p>
      <p>&copy; 2026 SPPG Portal Management System. All rights reserved.</p>
    </footer>

  </div>
</template>