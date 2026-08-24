<template>
  <div class="p-5 bg-slate-800 border border-slate-700 rounded-xl shadow-xl text-white w-full">
    <div class="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
      <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider">Admin - Input & Publish Menu MBG</h3>
      <span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">Admin Portal</span>
    </div>

    <form @submit.prevent="publishMenu" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold mb-1 text-slate-300">Nama Menu Makanan</label>
        <input 
          v-model="menuName" 
          type="text" 
          placeholder="Contoh: Nasi, Ayam Goreng, Sayur Asem" 
          required 
          class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500" 
        />
      </div>

      <div>
        <label class="block text-xs font-semibold mb-1 text-slate-300">Detail Nutrisi & Gizi</label>
        <textarea 
          v-model="nutritionInfo" 
          placeholder="Contoh: Kalori: 520 kcal | Protein: 28g | Karbohidrat: 65g" 
          required 
          class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white h-20 focus:outline-none focus:border-emerald-500 resize-none"
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-semibold mb-1 text-slate-300">Upload Foto Menu Makanan</label>
        <input 
          type="file" 
          accept="image/*" 
          @change="handleImageUpload" 
          class="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer" 
        />
      </div>

      <!-- Preview Foto -->
      <div v-if="imageBase64" class="mt-2">
        <p class="text-[11px] font-semibold text-slate-400 mb-1">Preview Foto Menu:</p>
        <img :src="imageBase64" alt="Preview" class="w-full h-32 object-cover rounded-lg border border-slate-700" />
      </div>

      <!-- Tombol Publish Utama -->
      <button 
        type="submit" 
        class="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition duration-150 shadow-lg cursor-pointer"
      >
        🚀 PUBLISH MENU & KIRIM KE SISWA
      </button>
    </form>

    <!-- Notifikasi Sukses -->
    <div v-if="isPublished" class="mt-3 p-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-center">
      <p class="text-xs text-emerald-400 font-bold">✓ Menu Berhasil Dipublish! Silakan Cek Halaman Siswa.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const menuName = ref('');
const nutritionInfo = ref('');
const imageBase64 = ref('');
const isPublished = ref(false);

onMounted(() => {
  const saved = localStorage.getItem('mbg_current_menu');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      menuName.value = parsed.title || '';
      nutritionInfo.value = parsed.info || '';
      imageBase64.value = parsed.img || '';
    } catch (e) {
      console.error(e);
    }
  }
});

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;

  const file = target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target?.result as string;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 400;
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      imageBase64.value = canvas.toDataURL('image/jpeg', 0.7);
    };
  };
  reader.readAsDataURL(file);
};

const publishMenu = () => {
  const data = {
    title: menuName.value,
    info: nutritionInfo.value,
    img: imageBase64.value,
    date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };

  localStorage.setItem('mbg_current_menu', JSON.stringify(data));
  window.dispatchEvent(new Event('mbg-menu-updated'));

  isPublished.value = true;
  setTimeout(() => {
    isPublished.value = false;
  }, 4000);
};
</script>