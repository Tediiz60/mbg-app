<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import logoBgn from '@/assets/sppg.webp'

const namaMenu = ref('')
const nutrisiValue = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const isUploading = ref(false)

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handlePublish = async () => {
  if (!fileInput.value?.files?.[0] || !namaMenu.value || !nutrisiValue.value) {
    alert('Mohon isi nama menu, rincian gizi, dan pilih foto terlebih dahulu!')
    return
  }

  isUploading.value = true
  const file = fileInput.value.files[0]
  const fileName = `${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (uploadError) {
    alert('Gagal upload foto: ' + uploadError.message)
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
        nama: namaMenu.value,
        nutrisi: nutrisiValue.value,
        image_url: publicUrlData.publicUrl
      }
    ])

  isUploading.value = false

  if (insertError) {
    alert('Gagal mempublish menu: ' + insertError.message)
  } else {
    alert('Berhasil! Menu & QR Code otomatis terupdate untuk semua siswa secara real-time.')
    handleClear()
  }
}

const handleClear = () => {
  namaMenu.value = ''
  nutrisiValue.value = ''
  previewUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center relative overflow-hidden">
    
    <!-- Background Glow Ornaments -->
    <div class="absolute -top-32 -right-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -left-32 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 relative z-10 transition-all duration-300 hover:border-slate-700">
      
      <!-- Header Admin -->
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800/80">
        <div class="relative">
          <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"></div>
          <img :src="logoBgn" alt="Logo SPPG" class="w-12 h-12 object-contain relative z-10" />
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">ADMIN PORTAL SPPG</h1>
          <p class="text-[10px] tracking-wide text-slate-400 font-medium">Input Menu & Foto (Sinkron Cloud Real-Time)</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-cyan-400 uppercase mb-1.5 tracking-wider">🍽️ Nama Menu Makanan</label>
          <input 
            v-model="namaMenu" 
            type="text" 
            placeholder="Contoh: Nasi Ayam Bergizi..." 
            class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 shadow-inner transition-all duration-200"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-emerald-400 uppercase mb-1.5 tracking-wider">🥗 Detail Nutrisi & Gizi</label>
          <textarea 
            v-model="nutrisiValue" 
            rows="3" 
            placeholder="Contoh: Kalori: 450 kcal, Protein: 25g..." 
            class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 shadow-inner transition-all duration-200 resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-teal-400 uppercase mb-1.5 tracking-wider">📷 Upload Foto Hasil Editan</label>
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            @change="handleFileChange" 
            class="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer bg-slate-950/80 border border-slate-800 rounded-xl p-2"
          />
        </div>

        <div v-if="previewUrl" class="space-y-1.5">
          <p class="text-xs font-medium text-slate-400">Preview Foto:</p>
          <div class="bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <img :src="previewUrl" alt="Preview" class="w-full h-48 object-cover rounded-xl shadow-md" />
          </div>
        </div>

        <div class="flex space-x-3 pt-3">
          <button 
            @click="handlePublish" 
            :disabled="isUploading"
            class="flex-1 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold py-3 rounded-xl transition duration-200 text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {{ isUploading ? 'MENYIMPAN...' : '⚡ PUBLISH MENU' }}
          </button>
          <button 
            @click="handleClear" 
            class="bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-3 rounded-xl transition duration-200 text-sm border border-slate-700/50 cursor-pointer"
          >
            Kosongkan
          </button>
        </div>
      </div>

    </div>
  </div>
</template>