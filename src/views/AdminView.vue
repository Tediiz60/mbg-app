<template>
  <div class="max-w-xl mx-auto p-6 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl text-white my-8">
    <div class="flex items-center justify-between mb-6 border-b border-slate-700 pb-3">
      <h3 class="text-base font-bold text-emerald-400 uppercase tracking-wider">Admin - Input & Publish Menu MBG</h3>
      <span class="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">Admin Portal</span>
    </div>

    <form @submit.prevent="publishMenu" class="space-y-4 text-left">
      <div>
        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Nama Menu Makanan</label>
        <input 
          v-model="form.title" 
          type="text" 
          placeholder="Contoh: Ayam Goreng + Nasi" 
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Detail Nutrisi & Gizi</label>
        <textarea 
          v-model="form.info" 
          rows="3" 
          placeholder="Contoh: Karbohidrat 45g, Protein 25g..." 
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          required
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Upload Foto Menu Makanan</label>
        <input 
          type="file" 
          accept="image/*" 
          @change="handleFileUpload" 
          class="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-slate-900 hover:file:bg-emerald-400 cursor-pointer"
        />
      </div>

      <div v-if="form.img" class="mt-2">
        <p class="text-xs text-slate-400 mb-1">Preview Foto Menu:</p>
        <img :src="form.img" class="w-full h-40 object-cover rounded-xl border border-slate-700" />
      </div>

      <button 
        type="submit" 
        class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl shadow-lg transition-all text-sm mt-4 uppercase tracking-wider"
      >
        🚀 Publish Menu & Kirim ke Siswa
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  title: '',
  info: '',
  img: ''
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.img = e.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  }
};

const publishMenu = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('id-ID', options);

  const menuData = {
    title: form.value.title,
    info: form.value.info,
    img: form.value.img,
    date: dateStr
  };

  localStorage.setItem('mbg_current_menu', JSON.stringify(menuData));
  
  // Broadcast ke tab lain
  window.dispatchEvent(new Event('mbg-menu-updated'));
  alert('Menu berhasil di-publish!');
};
</script>