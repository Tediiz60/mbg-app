<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const route = useRoute()
const slug = (route.params.slug as string) || 'sukahaji'

const mappingCabang: Record<string, string> = {
  'sleman-timur': 'SPPG Sleman Timur',
  'djati-pasundan': 'SPPG Djati Pasundan',
  'cihampelas': 'SPPG Cihampelas',
  'katapang': 'SPPG Katapang',
  'sukahaji': 'SPPG Sukahaji',
  'bandung-berkah': 'SPPG Bandung Berkah'
}

const cabangMenu = ref(mappingCabang[slug] || 'SPPG Cabang')
const imageUrl = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('menu')
      .select('*')
      .eq('cabang', cabangMenu.value)
      .order('id', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      imageUrl.value = data[0].image_url
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-center">
    <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-6">
      
      <div class="text-left border-b border-slate-800 pb-4">
        <h1 class="text-xl font-bold text-cyan-400">{{ cabangMenu }}</h1>
        <p class="text-xs text-slate-400">Portal Verifikasi Menu Resmi</p>
      </div>

      <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 min-h-[300px] flex items-center justify-center">
        <div v-if="isLoading" class="text-sm text-cyan-400">Memuat poster...</div>
        <img v-else-if="imageUrl" :src="imageUrl" alt="Poster" class="w-full rounded-xl object-contain max-h-[70vh]" />
        <div v-else class="text-sm text-slate-500 italic">Belum ada poster untuk cabang ini.</div>
      </div>

    </div>
  </div>
</template>