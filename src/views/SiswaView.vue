<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QrGenerator from '../components/QrGenerator.vue'
import { supabase } from '../lib/supabase'
import logoBgn from '@/assets/logo-bgn.png'

const qrValue = ref('')
const hasMenu = ref(false)
const namaMenu = ref('Memuat...')
const tanggal = ref('')

const fetchLatestMenu = async () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  const { data, error } = await supabase
    .from('menu')
    .select('*')

  if (error) {
    console.error('Error fetching menu:', error.message)
    hasMenu.value = false
    return
  }

  if (data && data.length > 0) {
    const latest = data[data.length - 1]
    hasMenu.value = true
    namaMenu.value = latest.nama
    qrValue.value = `${window.location.origin}/detail`
  } else {
    hasMenu.value = false
    namaMenu.value = 'Belum Ada Menu'
    qrValue.value = ''
  }
}

onMounted(() => {
  fetchLatestMenu()
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-6">
      
      <!-- Header SPPG -->
      <div class="flex items-center space-x-3 pb-3 border-b border-slate-800 text-left">
        <img :src="logoBgn" alt="Logo SPPG" class="w-11 h-11 object-contain" />
        <div>
          <h1 class="text-lg font-extrabold text-cyan-400">SPPG SLEMAN TIMUR</h1>
          <p class="text-[10px] text-slate-400">Badan Gizi Nasional - Republik Indonesia</p>
        </div>
      </div>

      <div v-if="!hasMenu" class="bg-slate-950 p-8 rounded-xl border border-slate-800 space-y-3">
        <div class="text-3xl">⏳</div>
        <p class="text-sm font-semibold text-amber-400">Admin Belum Mempublish Menu</p>
        <p class="text-xs text-slate-400 leading-relaxed">
          QR Code dan informasi menu makanan akan otomatis muncul setelah admin mengupload foto dan rincian menu.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div class="bg-slate-950 p-6 rounded-xl border border-slate-800 flex justify-center items-center">
          <div class="bg-white p-3 rounded-xl shadow-lg inline-block">
            <QrGenerator :value="qrValue" :size="180" />
          </div>
        </div>

        <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <p class="text-xs font-semibold text-slate-400 uppercase">Menu Makanan Aktif</p>
          <p class="text-lg font-bold text-cyan-400 capitalize">{{ namaMenu }}</p>
          <p class="text-xs text-slate-500">{{ tanggal }}</p>
        </div>

        <p class="text-xs text-slate-500 italic">
          📱 Scan QR Code di atas menggunakan HP siswa untuk melihat detail foto editan & nutrisi gizi makanan.
        </p>
      </div>

    </div>
  </div>
</template>