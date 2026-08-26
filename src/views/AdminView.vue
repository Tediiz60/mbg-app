<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import logoBgn from '@/assets/sppg.webp'

// 6 Pilihan Cabang SPPG
const daftarCabang = [
  'SPPG Sleman Timur',
  'SPPG Djati Pasundan',
  'SPPG Cihampelas',
  'SPPG Katapang',
  'SPPG Sukahaji',
  'SPPG Bandung Berkah'
]

const selectedCabang = ref(daftarCabang[0])
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
  if (!fileInput.value?.files?.[0] || !selectedCabang.value) {
    alert('Mohon pilih cabang SPPG dan upload foto poster menu terlebih dahulu!')
    return
  }

  isUploading.value = true
  const file = fileInput.value.files[0]
  const fileName = `${Date.now()}-${file.name}`

  // 1. Upload foto poster ke Supabase Storage
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

  // 3. Simpan data ke tabel menu
  const { error: insertError } = await supabase
    .from('menu')
    .insert([
      {
        cabang: selectedCabang.value,
        image_url: publicUrlData.publicUrl
      }
    ])

  isUploading.value = false

  if (insertError) {
    alert('Gagal mempublish menu: ' + insertError.message)
  } else {
    alert('Berhasil! Poster menu untuk ' + selectedCabang.value + ' berhasil dipublish secara real-time.')
    handleClear()
  }
}

const handleClear = () => {
  previewUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex justify-center items-center relative overflow-y-auto">
    
    <!-- Background Glow Ornaments -->
    <div class="absolute -top-32 -right-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -left-32 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 relative z-10 my-8">
      
      <!-- Header Admin -->
      <div class="flex items-center space-x-3 pb-4 border-b border-slate-800/80">
        <div class="relative">
          <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"></div>
          <img :src="logoBgn" alt="Logo SPPG" class="w-12 h-12 object-contain relative z-10" />
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">ADMIN PORTAL SPPG</h1>
          <p class="text-[10px] tracking-wide text-slate-400 font-medium">Upload Poster Gizi & Pilih Cabang</p>
        </div>
      </div>

      <div class="space-y-5">
        <!-- Pilihan Cabang SPPG -->
        <div>
          <label class="block text-xs font-bold text-cyan-400 uppercase mb-2 tracking-wider">🏢 Pilih Cabang SPPG</label>
          <select 
            v-model="selectedCabang"
            class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 shadow-inner cursor-pointer"
          >
            <option v-for="cabang in daftarCabang" :key="cabang" :value="cabang">
              {{ cabang }}
            </option>
          </select>
        </div>

        <!-- Upload Foto Poster -->
        <div>
          <label class="block text-xs font-bold text-emerald-400 uppercase mb-2 tracking-wider">🖼️ Upload Foto Poster Menu (Lengkap Analisa Gizi)</label>
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            @change="handleFileChange" 
            class="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer bg-slate-950/80 border border-slate-800 rounded-xl p-2"
          />
        </div>

        <!-- Preview Poster -->
        <div v-if="previewUrl" class="space-y-1.5">
          <p class="text-xs font-medium text-slate-400">Preview Poster:</p>
          <div class="bg-slate-950 p-2 rounded-2xl border border-slate-800 max-h-80 overflow-y-auto">
            <img :src="previewUrl" alt="Preview Poster" class="w-full object-contain rounded-xl shadow-md" />
          </div>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex space-x-3 pt-3">
          <button 
            @click="handlePublish" 
            :disabled="isUploading"
            class="flex-1 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold py-3 rounded-xl transition duration-200 text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {{ isUploading ? 'MENYIMPAN...' : '⚡ PUBLISH POSTER' }}
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