<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import logoMbg from '@/assets/mbg.jpg'

const router = useRouter()

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

const showSuccessModal = ref(false)
const modalMessage = ref('')

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
  } else {
    alert('Password cabang salah!')
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
    modalMessage.value = 'Pilih foto poster dulu!'
    showSuccessModal.value = true
    return
  }

  isUploading.value = true
  const file = fileInput.value.files[0]
  const fileName = `${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (uploadError) {
    modalMessage.value = 'Gagal upload: ' + uploadError.message
    showSuccessModal.value = true
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
    modalMessage.value = 'Gagal publish: ' + insertError.message
    showSuccessModal.value = true
  } else {
    modalMessage.value = `Poster menu harian untuk ${activeCabang.value.nama} berhasil dipublish!`
    showSuccessModal.value = true
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
  <div class="min-h-screen bg-slate-950 text-white p-6 flex flex-col justify-center items-center relative overflow-hidden">
    
    <!-- Efek Cahaya Estetik di Background -->
    <div class="absolute top-1/4 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- MODAL NOTIFIKASI -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
        <div class="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-cyan-500/30 shadow-inner">
          🎉
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-extrabold text-cyan-400 tracking-wide">PUBLISH BERHASIL!</h3>
          <p class="text-xs text-slate-300 leading-relaxed">{{ modalMessage }}</p>
        </div>
        <button 
          @click="showSuccessModal = false"
          class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-xs cursor-pointer transition shadow-lg"
        >
          LIHAT QR CODE CABANG
        </button>
      </div>
    </div>

    <!-- KOTAK UTAMA ADMIN PANEL -->
    <div class="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-7 shadow-2xl space-y-6 relative z-10">
      
      <!-- Header Admin -->
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800/80">
        <img :src="logoMbg" alt="Logo MBG" class="w-13 h-13 object-contain rounded-full border border-cyan-500/30 p-0.5 shadow-md" />
        <div>
          <div class="flex items-center space-x-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Secure Portal Area</span>
          </div>
          <h1 class="text-base font-extrabold text-white">PANEL KELOLA ADMIN</h1>
        </div>
      </div>

      <!-- FORM LOGIN -->
      <div v-if="!isLoggedIn" class="space-y-4">
        <p class="text-xs text-slate-400 leading-relaxed">
          Silakan pilih wilayah cabang penugasan Anda dan masukkan kredensial akses yang valid.
        </p>

        <div class="space-y-1.5">
          <label class="block text-[11px] font-bold text-slate-300">Pilih Wilayah Cabang</label>
          <select v-model="inputCabangNama" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-cyan-500 transition">
            <option v-for="c in daftarCabang" :key="c.slug" :value="c.nama">{{ c.nama }}</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="block text-[11px] font-bold text-slate-300">Password Akses Cabang</label>
          <div class="relative">
            <input 
              v-model="inputPassword" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Masukkan password rahasia..." 
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-12 text-xs focus:outline-none focus:border-cyan-500 transition text-white" 
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
          MASUK KE PANEL ADMIN 🚀
        </button>
      </div>

      <!-- SETELAH LOGIN BERHASIL -->
      <div v-else class="space-y-4">
        <!-- SALAM HANGAT ESTETIK -->
        <div class="flex justify-between items-center bg-gradient-to-r from-cyan-950/60 to-slate-900 p-4 rounded-2xl border border-cyan-800/50 shadow-inner">
          <div class="space-y-0.5">
            <p class="text-[11px] font-extrabold text-cyan-300 tracking-wide">{{ salamWaktu }}, Admin!</p>
            <p class="text-xs font-bold text-white truncate max-w-[240px]">{{ activeCabang.nama }}</p>
          </div>
          <button @click="handleLogout" class="bg-red-500/15 hover:bg-red-500/25 text-red-400 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition border border-red-500/30">Keluar</button>
        </div>

        <!-- FORM UPLOAD -->
        <div v-if="!hasPublished" class="space-y-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
          <div class="space-y-1">
            <label class="block text-xs font-bold text-emerald-400">📤 Update Poster Menu Harian</label>
            <p class="text-[10px] text-slate-400">Pilih gambar poster menu terbaru untuk dibagikan ke siswa.</p>
          </div>

          <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="w-full text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl p-2.5 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400" />

          <div v-if="previewUrl">
            <img :src="previewUrl" alt="Preview" class="w-full max-h-52 object-contain rounded-xl border border-slate-800 shadow-md" />
          </div>

          <button @click="handlePublish" :disabled="isUploading" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs cursor-pointer disabled:opacity-50 transition shadow-lg shadow-cyan-500/20">
            {{ isUploading ? 'SEDANG MENGUNGGAH...' : 'PUBLISH POSTER SEKARANG ✨' }}
          </button>
        </div>

        <!-- TAMPILAN QR CODE -->
        <div v-else class="bg-slate-950/80 p-5 rounded-2xl border border-cyan-500/40 text-center space-y-4 shadow-xl">
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
          
          <div class="text-[11px] text-cyan-300 font-mono bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800 truncate">
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

    <!-- Copyright Footer -->
    <div class="mt-6 text-center text-[10px] text-slate-500 tracking-wider relative z-10">
      SPPG Management System &copy; 2026 &bull; Badan Gizi Nasional
    </div>
  </div>
</template>