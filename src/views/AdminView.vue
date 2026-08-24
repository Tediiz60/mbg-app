<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const namaMenu = ref('')
const nutrisi = ref('')
const fileGambar = ref<File | null>(null)
const previewUrl = ref('')
const isLoading = ref(false)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    fileGambar.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const publishMenu = async () => {
  if (!namaMenu.value || !nutrisi.value || !fileGambar.value) {
    alert('Harap isi Nama Menu, Detail Nutrisi, dan Pilih Foto Editan!')
    return
  }

  isLoading.value = true

  try {
    // 1. Upload foto editan ke Supabase Storage
    const fileName = `${Date.now()}_${fileGambar.value.name}`
    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(fileName, fileGambar.value)

    if (uploadError) throw uploadError

    // 2. Ambil URL publik foto tersebut
    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName)

    const imageUrl = publicUrlData.publicUrl

    // 3. Simpan data baru ke tabel database Supabase
    const { error: dbError } = await supabase
      .from('menu')
      .insert([{ 
        nama: namaMenu.value, 
        nutrisi: nutrisi.value, 
        image_url: imageUrl 
      }])

    if (dbError) throw dbError

    alert('⚡ Berhasil! Menu & QR Code otomatis terupdate untuk semua siswa secara real-time.')
    
    // Admin TETAP DI HALAMAN INI (tidak dipindah paksa ke halaman siswa)
    namaMenu.value = ''
    nutrisi.value = ''
    fileGambar.value = null
    previewUrl.value = ''
  } catch (err: any) {
    alert('Gagal mempublish menu: ' + err.message)
  } finally {
    isLoading.value = false
  }
}

const resetMenu = async () => {
  if (confirm('Yakin ingin mengosongkan menu hari ini?')) {
    try {
      await supabase.from('menu').delete().neq('id', 0)
      alert('Menu berhasil dikosongkan.')
    } catch (e: any) {
      alert('Gagal: ' + e.message)
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 md:p-6 flex justify-center items-center">
    <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
      
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-xl font-bold text-emerald-400">ADMIN PORTAL MBG</h1>
          <p class="text-xs text-slate-400">Input Menu & Foto (Sinkron Cloud Real-Time)</p>
        </div>
        <router-link to="/siswa" target="_blank" class="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs px-3 py-1.5 rounded-xl font-semibold transition">
          Buka Layar Siswa ➔
        </router-link>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Nama Menu Makanan</label>
          <input 
            v-model="namaMenu" 
            type="text" 
            placeholder="Contoh: Ayam Utey" 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition" 
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Detail Nutrisi & Gizi</label>
          <textarea 
            v-model="nutrisi" 
            rows="3" 
            placeholder="Contoh: Kalori: 450 kcal..." 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Upload Foto Hasil Editan</label>
          <input 
            type="file" 
            accept="image/*" 
            @change="handleFileUpload" 
            class="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 cursor-pointer border border-slate-800 rounded-xl p-1"
          />
        </div>

        <div v-if="previewUrl" class="space-y-1">
          <p class="text-xs text-slate-400">Preview Foto:</p>
          <div class="h-32 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
          </div>
        </div>

        <div class="flex gap-3">
          <button 
            @click="publishMenu" 
            :disabled="isLoading"
            class="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            <span>⚡</span> {{ isLoading ? 'MENYIMPAN...' : 'PUBLISH MENU' }}
          </button>
          <button 
            @click="resetMenu" 
            class="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-semibold px-4 py-3 rounded-xl transition text-xs cursor-pointer"
          >
            Kosongkan
          </button>
        </div>
      </div>

    </div>
  </div>
</template>