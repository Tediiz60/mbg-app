<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const namaMenu = ref('')
const nutrisi = ref('')
const imageUrl = ref('')

const publishMenu = () => {
  if (!namaMenu.value || !nutrisi.value) {
    alert('Harap isi Nama Menu dan Detail Nutrisi terlebih dahulu!')
    return
  }

  const menuData = {
    nama: namaMenu.value,
    nutrisi: nutrisi.value,
    image: imageUrl.value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  }

  // Simpan ke localStorage
  localStorage.setItem('mbg_menu', JSON.stringify(menuData))
  alert('⚡ Menu berhasil dipublish untuk hari ini/besok!')
  router.push('/siswa')
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 md:p-6 flex justify-center items-center">
    <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
      
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-xl font-bold text-emerald-400">ADMIN PORTAL MBG</h1>
          <p class="text-xs text-slate-400">Input & Publish Menu Makanan</p>
        </div>
        <!-- Tombol ke Portal Siswa khusus untuk admin melihat hasil QR -->
        <router-link to="/siswa" class="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs px-3 py-1.5 rounded-xl font-semibold transition">
          Lihat QR Siswa ➔
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
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Link Foto Makanan (URL Gambar)</label>
          <input 
            v-model="imageUrl" 
            type="text" 
            placeholder="Contoh: https://images.unsplash.com/photo-... (atau biarkan kosong)" 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition" 
          />
          <p class="text-[11px] text-slate-500 mt-1">Tips: Masukkan link gambar online atau biarkan kosong untuk pakai foto default.</p>
        </div>

        <button 
          @click="publishMenu" 
          class="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          <span>⚡</span> PUBLISH MENU & GENERATE QR CODE
        </button>
      </div>

    </div>
  </div>
</template>