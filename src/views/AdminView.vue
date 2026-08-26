<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import logoBgn from '@/assets/sppg.webp'

const router = useRouter()

interface Cabang {
  nama: string
  slug: string
  password: string
}

const daftarCabang: Cabang[] = [
  { nama: 'SPPG Sleman Timur', slug: 'sleman-timur', password: 'sleman123' },
  { nama: 'SPPG Djati Pasundan', slug: 'djati-pasundan', password: 'djati123' },
  { nama: 'SPPG Cihampelas', slug: 'cihampelas', password: 'cihampelas123' },
  { nama: 'SPPG Katapang', slug: 'katapang', password: 'katapang123' },
  { nama: 'SPPG Sukahaji', slug: 'sukahaji', password: 'sukahaji123' },
  { nama: 'SPPG Bandung Berkah', slug: 'bandung-berkah', password: 'bandung123' }
]

const isLoggedIn = ref(false)
const inputCabangNama = ref('SPPG Sleman Timur')
const inputPassword = ref('')
const showPassword = ref(false)
const activeCabang = ref<Cabang>(daftarCabang[0]!)

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const isUploading = ref(false)

// Status apakah sudah berhasil publish
const hasPublished = ref(false)

const qrCodeUrl = computed(() => {
  const targetUrl = `https://mbg-5mm6.vercel.app/detail/${activeCabang.value.slug}`
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
    alert('Pilih foto poster dulu!')
    return
  }

  isUploading.value = true
  const file = fileInput.value.files[0]
  const fileName = `${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (uploadError) {
    alert('Gagal upload: ' + uploadError.message)
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
    alert('Gagal publish: ' + insertError.message)
  } else {
    alert('Berhasil publish poster untuk ' + activeCabang.value.nama + '!')
    hasPublished.value = true // ✨ Form upload langsung disembunyikan total!
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
  <div class="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-center">
    <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800">
        <img :src="logoBgn" alt="Logo" class="w-12 h-12 object-contain" />
        <div>
          <h1 class="text-lg font-bold text-cyan-400">ADMIN PORTAL SPPG</h1>
          <p class="text-xs text-slate-400">Login & Upload Per Cabang</p>
        </div>
      </div>

      <div v-if="!isLoggedIn" class="space-y-4">
        <div>
          <label class="block text-xs text-slate-400 mb-1">Pilih Cabang</label>
          <select v-model="inputCabangNama" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm cursor-pointer">
            <option v-for="c in daftarCabang" :key="c.slug" :value="c.nama">{{ c.nama }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs text-slate-400 mb-1">Password</label>
          <div class="relative">
            <input 
              v-model="inputPassword" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Password cabang..." 
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-12 text-sm focus:outline-none focus:border-cyan-500" 
              @keyup.enter="handleLogin" 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 text-xs font-bold px-2 py-1 cursor-pointer select-none"
            >
              {{ showPassword ? '🙈 Sembunyikan' : '👁️ Lihat' }}
            </button>
          </div>
        </div>

        <button @click="handleLogin" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-sm cursor-pointer transition">
          MASUK PANEL
        </button>
      </div>

      <div v-else class="space-y-4">
        <div class="flex justify-between items-center bg-cyan-950/40 p-3 rounded-xl border border-cyan-800">
          <div>
            <p class="text-[10px] text-cyan-300">Aktif:</p>
            <p class="text-sm font-bold">{{ activeCabang.nama }}</p>
          </div>
          <button @click="handleLogout" class="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer">Keluar</button>
        </div>

        <!-- ✨ KONDISI: JIKA BELUM PUBLISH, MUNCUL FORM UPLOAD -->
        <div v-if="!hasPublished" class="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <label class="block text-xs font-bold text-emerald-400 mb-2">Upload Poster Menu Baru Hari Ini</label>
            <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="w-full text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl p-2 cursor-pointer" />
          </div>

          <div v-if="previewUrl">
            <img :src="previewUrl" alt="Preview" class="w-full max-h-60 object-contain rounded-xl border border-slate-800" />
          </div>

          <button @click="handlePublish" :disabled="isUploading" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-sm cursor-pointer disabled:opacity-50">
            {{ isUploading ? 'MENYIMPAN...' : 'PUBLISH POSTER' }}
          </button>
        </div>

        <!-- ✨ KONDISI: JIKA SUDAH PUBLISH, FORM UPLOAD HILANG, BERSIH MURNI TAMPILAN QR CODE SAJA -->
        <div v-else class="bg-slate-950 p-5 rounded-2xl border border-cyan-500/50 text-center space-y-4 shadow-xl">
          <div class="space-y-1">
            <p class="text-xs font-bold text-emerald-400">🎉 Poster Berhasil Dipublish!</p>
            <p class="text-[11px] text-slate-400">Scan QR Code di bawah untuk melihat menu:</p>
          </div>
          
          <div class="bg-white p-4 rounded-2xl inline-block shadow-lg">
            <img 
              :src="qrCodeUrl" 
              alt="QR Code Cabang" 
              class="w-40 h-40 mx-auto object-contain"
            />
          </div>
          
          <p class="text-[11px] text-cyan-300 font-mono bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800">
            /detail/{{ activeCabang.slug }}
          </p>
          
          <div class="space-y-2 pt-2">
            <button 
              @click="goToStudentView"
              class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>👀 Lihat Menu Tampilan Siswa</span>
            </button>

            <button 
              @click="resetUpload"
              class="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition border border-slate-700"
            >
              🔄 Upload Poster Baru (Ganti Menu)
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>