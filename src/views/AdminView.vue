<script setup lang="ts">
import { ref, onMounted } from 'vue'

const namaMenu = ref('')
const nutrisi = ref('')
const fotoBase64 = ref('')

onMounted(() => {
  const savedData = localStorage.getItem('mbg_menu')
  if (savedData) {
    const data = JSON.parse(savedData)
    namaMenu.value = data.nama || ''
    nutrisi.value = data.nutrisi || ''
    fotoBase64.value = data.image || ''
  }
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      fotoBase64.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const publishMenu = () => {
  if (!namaMenu.value || !nutrisi.value) {
    alert('Harap isi Nama Menu dan Detail Nutrisi!')
    return
  }

  const menuData = {
    nama: namaMenu.value,
    nutrisi: nutrisi.value,
    image: fotoBase64.value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  }

  localStorage.setItem('mbg_menu', JSON.stringify(menuData))
  alert('Menu berhasil dipublish!')
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-emerald-400">ADMIN - INPUT & PUBLISH MENU MBG</h1>

    <div class="space-y-4 bg-slate-800 p-6 rounded-xl border border-slate-700">
      <div>
        <label class="block text-sm font-semibold mb-2">NAMA MENU MAKANAN</label>
        <input 
          v-model="namaMenu" 
          type="text" 
          placeholder="Masukkan nama menu..." 
          class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500" 
        />
      </div>

      <div>
        <label class="block text-sm font-semibold mb-2">DETAIL NUTRISI & GIZI</label>
        <textarea 
          v-model="nutrisi" 
          rows="3" 
          placeholder="Masukkan detail gizi..." 
          class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-2">UPLOAD FOTO MENU MAKANAN</label>
        <input 
          type="file" 
          accept="image/*" 
          @change="handleFileUpload" 
          class="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
        />
      </div>

      <div v-if="fotoBase64" class="mt-4">
        <p class="text-xs text-slate-400 mb-2">Preview Foto Menu:</p>
        <img :src="fotoBase64" alt="Preview" class="w-full h-48 object-cover rounded-lg border border-slate-700" />
      </div>

      <button 
        @click="publishMenu" 
        class="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-lg transition"
      >
        Publish Menu
      </button>
    </div>
  </div>
</template>