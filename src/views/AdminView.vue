<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const namaMenu = ref('')
const nutrisi = ref('')
const fotoBase64 = ref('')

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        // Kompres ukuran gambar agar pas dan ringan di QR Code
        const MAX_WIDTH = 250
        const MAX_HEIGHT = 250
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        fotoBase64.value = canvas.toDataURL('image/jpeg', 0.5)
      }
    }
    reader.readAsDataURL(file)
  }
}

const publishMenu = () => {
  if (!namaMenu.value || !nutrisi.value || !fotoBase64.value) {
    alert('Harap isi Nama Menu, Detail Nutrisi, dan Upload Foto hasil editan terlebih dahulu!')
    return
  }

  const menuData = {
    nama: namaMenu.value,
    nutrisi: nutrisi.value,
    image: fotoBase64.value
  }

  // Simpan ke localStorage agar QR code di siswa langsung muncul
  localStorage.setItem('mbg_menu', JSON.stringify(menuData))
  alert('⚡ Menu & Foto Berhasil Dipublish! QR Code sekarang aktif di Portal Siswa.')
  router.push('/siswa')
}

const resetMenu = () => {
  if (confirm('Yakin ingin menghapus menu hari ini? QR Code di siswa akan disembunyikan.')) {
    localStorage.removeItem('mbg_menu')
    alert('Menu berhasil dikosongkan.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 md:p-6 flex justify-center items-center">
    <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
      
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-xl font-bold text-emerald-400">ADMIN PORTAL MBG</h1>
          <p class="text-xs text-slate-400">Input Menu & Upload Foto Sendiri</p>
        </div>
        <router-link to="/siswa" class="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs px-3 py-1.5 rounded-xl font-semibold transition">
          Lihat Portal Siswa ➔
        </router-link>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Nama Menu Makanan</label>
          <input 
            v-model="namaMenu" 
            type="text" 
            placeholder="Contoh: Ayam Betutu & Sayur Nangka" 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition" 
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Detail Nutrisi & Gizi</label>
          <textarea 
            v-model="nutrisi" 
            rows="3" 
            placeholder="Contoh: Kalori: 400 kcal, Protein: 28g..." 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Upload Foto Hasil Editan (Dari Komputer)</label>
          <input 
            type="file" 
            accept="image/*" 
            @change="handleFileUpload" 
            class="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 cursor-pointer border border-slate-800 rounded-xl p-1"
          />
        </div>

        <div v-if="fotoBase64" class="space-y-1">
          <p class="text-xs text-slate-400">Preview Foto:</p>
          <div class="h-32 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            <img :src="fotoBase64" alt="Preview" class="w-full h-full object-cover" />
          </div>
        </div>

        <div class="flex gap-3">
          <button 
            @click="publishMenu" 
            class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            <span>⚡</span> PUBLISH & MUNCULKAN QR
          </button>
          <button 
            @click="resetMenu" 
            class="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-semibold px-4 py-3 rounded-xl transition text-xs cursor-pointer"
          >
            Kosongkan Menu
          </button>
        </div>
      </div>

    </div>
  </div>
</template>