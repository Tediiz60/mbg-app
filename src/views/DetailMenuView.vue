<template>
  <div class="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center justify-center">
    <div class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
      <div class="text-center border-b border-slate-700 pb-3">
        <span class="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">Verifikasi Menu MBG</span>
        <h2 class="text-xl font-extrabold text-sky-400 mt-2">Detail Menu & Nutrisi</h2>
        <p class="text-xs text-slate-400 mt-1 font-mono" v-if="menuData.date">{{ menuData.date }}</p>
      </div>

      <div v-if="menuData.title" class="space-y-4">
        <!-- Foto Makanan -->
        <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center h-52">
          <img 
            :src="menuData.img || fallbackImage" 
            alt="Foto Makanan" 
            class="w-full h-full object-cover" 
          />
        </div>

        <!-- Nama Makanan -->
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Menu</p>
          <h3 class="text-xl font-black text-sky-300 mt-0.5">{{ menuData.title }}</h3>
        </div>

        <!-- Detail Gizi -->
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Kandungan Nutrisi & Gizi</p>
          <p class="text-xs text-slate-200 whitespace-pre-line leading-relaxed">{{ menuData.info }}</p>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-xs text-slate-400">Data menu tidak ditemukan. Silakan scan ulang QR Code.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop';

const menuData = ref({
  title: '',
  info: '',
  img: '',
  date: ''
});

onMounted(() => {
  // Ambil data langsung dari IP Network & LocalStorage sync
  const saved = localStorage.getItem('mbg_current_menu');
  let localObj = null;
  if (saved) {
    try { localObj = JSON.parse(saved); } catch (e) {}
  }

  const queryTitle = route.query.t as string;
  const queryInfo = route.query.i as string;
  const queryDate = route.query.d as string;

  menuData.value = {
    title: queryTitle || localObj?.title || '',
    info: queryInfo || localObj?.info || '',
    img: localObj?.img || '',
    date: queryDate || localObj?.date || ''
  };
});
</script>