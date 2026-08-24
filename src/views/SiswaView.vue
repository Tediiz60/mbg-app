<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QrGenerator from '../components/QrGenerator.vue'
import { supabase } from '../lib/supabase'

const qrValue = ref('')
const hasMenu = ref(false)
const namaMenu = ref('Memuat...')
const tanggal = ref('')

const fetchLatestMenu = async () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  const { data } = await supabase
    .from('menu')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  if (data && data.length > 0) {
    hasMenu.value = true
    namaMenu.value = data[0].nama
    // QR Code mengarah ke halaman detail bersih dari cloud
    qrValue.value = `${window.location.origin}/detail`
  } else {
    hasMenu.value = false
    namaMenu.value = 'Belum Ada Menu'
    qrValue.value = ''
  }
}

onMounted(() => {
  fetchLatestMenu()

  // Real-time listener: otomatis update ke semua perangkat siswa begitu admin publish
  supabase
    .channel('public:menu')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, () => {
      fetchLatestMenu()
    })
    .subscribe()
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 flex justify-center items-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-6">
      
      <div class="text-left pb-3 border-b border-slate-800">
        <h1 class="text-xl font-extrabold text-cyan-400">SCAN MENU MBG</h1>
        <p class="text-[11px] text-slate-400">Makan Bergizi Gratis - SMAN/SMK</p>
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