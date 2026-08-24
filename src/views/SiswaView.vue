<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QrGenerator from '../components/QrGenerator.vue'

const route = useRoute()
const qrValue = ref('')
const hasMenu = ref(false)
const namaMenu = ref('Belum Ada Menu')
const tanggal = ref('')

const loadMenuData = () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  tanggal.value = new Date().toLocaleDateString('id-ID', options)

  const queryMenu = route.query.m as string
  const queryNutrisi = route.query.u as string
  const queryImage = route.query.i as string

  if (queryMenu) {
    hasMenu.value = true
    namaMenu.value = queryMenu
    localStorage.setItem('mbg_menu', JSON.stringify({
      nama: queryMenu,
      nutrisi: queryNutrisi || '',
      image: queryImage || ''
    }))
    qrValue.value = `${window.location.origin}/detail?m=${encodeURIComponent(queryMenu)}`
    return
  }

  const savedData = localStorage.getItem('mbg_menu')
  if (savedData) {
    try {
      const data = JSON.parse(savedData)
      if (data && data.nama) {
        hasMenu.value = true
        namaMenu.value = data.nama
        
        const params = new URLSearchParams({
          m: data.nama,
          u: data.nutrisi || '',
          i: data.image || ''
        })
        const newUrl = `${window.location.origin}/siswa?${params.toString()}`
        window.history.replaceState({}, '', newUrl)

        qrValue.value = `${window.location.origin}/detail?m=${encodeURIComponent(data.nama)}`
        return
      }
    } catch (e) {}
  }

  hasMenu.value = false
  namaMenu.value = 'Belum Ada Menu'
  qrValue.value = ''
}

onMounted(() => {
  loadMenuData()
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
          📱 Scan QR Code di atas menggunakan HP siswa untuk melihat detail foto & nutrisi gizi makanan.
        </p>
      </div>

    </div>
  </div>
</template>