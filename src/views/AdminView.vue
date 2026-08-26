<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import logoBgn from '@/assets/sppg.webp'

// Daftar 6 Cabang beserta Password login khususnya
const daftarCabang = [
  { nama: 'SPPG Sleman Timur', password: 'sleman123' },
  { nama: 'SPPG Djati Pasundan', password: 'djati123' },
  { nama: 'SPPG Cihampelas', password: 'cihampelas123' },
  { nama: 'SPPG Katapang', password: 'katapang123' },
  { nama: 'SPPG Sukahaji', password: 'sukahaji123' },
  { nama: 'SPPG Bandung Berkah', password: 'bandung123' }
]

const isLoggedIn = ref(false)
const inputCabang = ref('SPPG Sleman Timur')
const inputPassword = ref('')
const errorLogin = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const isUploading = ref(false)

// Fungsi Login
const handleLogin = () => {
  const cabangDitemukan = daftarCabang.find(c => c.nama === inputCabang.value)
  if (cabangDitemukan && cabangDitemukan.password === inputPassword.value) {
    isLoggedIn.value = true
    errorLogin.value = false
    inputPassword.value = ''
  } else {
    errorLogin.value = true
    alert('Password cabang salah! Silakan coba lagi.')
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  inputPassword.value = ''
  previewUrl.value = ''
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handlePublish = async () => {
  if (!fileInput.value?.files?.[0]) {
    alert('Mohon pilih dan upload foto poster menu terlebih dahulu!')
    return
  }

  isUploading.value = true
  const file = fileInput.value.files[0]
  const fileName = `${Date.now()}-${file.name}`

  // 1. Upload foto ke Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (uploadError) {
    alert('Gagal upload foto: ' + uploadError.message)
    isUploading.value = false
    return
  }

  // 2. Ambil Public URL
  const { data: publicUrlData } = supabase.storage
    .from('menu-images')
    .getPublicUrl(fileName)

  // 3. Simpan ke database dengan nama cabang yang sedang login
  const { error: insertError } = await supabase
    .from('menu')
    .insert([
      {
        cabang: inputCabang.value,
        image_url: publicUrlData.publicUrl
      }
    ])

  isUploading.value = false

  if (insertError) {
    alert('Gagal mempublish poster: ' + insertError.message)
  } else {
    alert('Berhasil! Poster untuk ' + inputCabang.value + ' berhasil dipublish secara real-time.')
    previewUrl.value = ''
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex justify-center items-center relative overflow-y-auto">
    
    <!-- Background Glow -->
    <div class="absolute -top-32 -right-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -left-32 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 relative z-10 my-8">
      
      <!-- Header -->
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800/80">
        <div class="relative">
          <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"></div>
          <img :src="logoBgn" alt="Logo SPPG" class="w-12 h-12 object-contain relative z-10" />
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">ADMIN PORTAL SPPG</h1>
          <p class="text-[10px] tracking-wide text-slate-400 font-medium">Sistem Login Keamanan Per Cabang</p>
        </div>
      </div>

      <!-- FORM LOGIN ADMIN CABANG -->
      <div v-if="!isLoggedIn" class="space-y-4 py-2">
        <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
          <p class="text-xs font-bold text-cyan-400 uppercase tracking-wider">🔐 Silakan Login Admin Cabang</p>
          
          <div>
            <label class="block text-xs text-slate-400 mb-1">Pilih Cabang SPPG</label>
            <select 
              v-model="inputCabang"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option v-for="c in daftarCabang" :key="c.nama" :value="c.nama">{{ c.nama }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Password Cabang</label>
            <input 
              v-model="inputPassword"
              type="password"
              placeholder="Masukkan password cabang..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
              @keyup.enter="handleLogin"
            />
          </div>

          <button 
            @click="handleLogin"
            class="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold py-3 rounded-xl transition duration-200 text-sm shadow-lg shadow-cyan-500/20 cursor-pointer mt-2"
          >
            MASUK ADMIN CABANG
          </button>
        </div>
      </div>

      <!-- PANEL UPLOAD POSTER (SETELAH LOGIN BERHASIL) -->
      <div v-else class="space-y-5">
        <div class="flex justify-between items-center bg-cyan-950/40 border border-cyan-800/50 p-3.5 rounded-2xl">
          <div>
            <p class="text-[10px] text-cyan-300 font-semibold uppercase">Status Login:</p>
            <p class="text-sm font-bold text-white">🟢 {{ inputCabang }}</p>
          </div>
          <button 
            @click="handleLogout"
            class="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
          >
            Keluar
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-emerald-400 uppercase mb-2 tracking-wider">🖼️ Upload Poster Menu Cabang Ini</label>
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            @change="handleFileChange" 
            class="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer bg-slate-950/80 border border-slate-800 rounded-xl p-2"
          />
        </div>

        <div v-if="previewUrl" class="space-y-1.5">
          <p class="text-xs font-medium text-slate-400">Preview Poster:</p>
          <div class="bg-slate-950 p-2 rounded-2xl border border-slate-800 max-h-80 overflow-y-auto">
            <img :src="previewUrl" alt="Preview Poster" class="w-full object-contain rounded-xl shadow-md" />
          </div>
        </div>

        <button 
          @click="handlePublish" 
          :disabled="isUploading"
          class="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold py-3 rounded-xl transition duration-200 text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
        >
          {{ isUploading ? 'MENYIMPAN...' : '⚡ PUBLISH POSTER KE CABANG INI' }}
        </button>
      </div>

    </div>
  </div>
</template>