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

  // 1. Upload foto ke Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (uploadError) {
    alert('Gagal upload foto: ' + uploadError.message)
    isUploading.value = false
    return
  }

  // 2. Ambil Public URL foto
  const { data: publicUrlData } = supabase.storage
    .from('menu-images')
    .getPublicUrl(fileName)

  // 3. Masukkan data ke tabel menu
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
    namaMenu.value = ''
    nutrisiValue.value = ''
    previewUrl.value = ''
    if (fileInput.value) fileInput.value.value = ''
  }
}

const handleClear = () => {
  namaMenu.value = ''
  nutrisiValue.value = ''
  previewUrl.value = ''
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center">
    <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      <!-- Header SPPG Admin -->
      <div class="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <img :src="logoBgn" alt="Logo SPPG" class="w-11 h-11 object-contain" />
        <div>
          <h1 class="text-lg font-extrabold text-cyan-400">ADMIN PORTAL SPPG</h1>
          <p class="text-[10px] text-slate-400">Input Menu & Foto (Sinkron Cloud Real-Time)</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Nama Menu Makanan</label>
          <input 
            v-model="namaMenu" 
            type="text" 
            placeholder="Contoh: Nasi Ayam Berkizi..." 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Detail Nutrisi & Gizi</label>
          <textarea 
            v-model="nutrisiValue" 
            rows="3" 
            placeholder="Contoh: Kalori: 450 kcal, Protein: 25g..." 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Upload Foto Hasil Editan</label>
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            @change="handleFileChange" 
            class="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
          />
        </div>

        <div v-if="previewUrl" class="space-y-1">
          <p class="text-xs text-slate-400">Preview Foto:</p>
          <img :src="previewUrl" alt="Preview" class="w-full h-48 object-cover rounded-xl border border-slate-800" />
        </div>

        <div class="flex space-x-3 pt-2">
          <button 
            @click="handlePublish" 
            :disabled="isUploading"
            class="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl transition duration-200 text-sm disabled:opacity-50"
          >
            {{ isUploading ? 'MENYIMPAN...' : '⚡ PUBLISH MENU' }}
          </button>
          <button 
            @click="handleClear" 
            class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl transition duration-200 text-sm"
          >
            Kosongkan
          </button>
        </div>
      </div>

    </div>
  </div>
</template>