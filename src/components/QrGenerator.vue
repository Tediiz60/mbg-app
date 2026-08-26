<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import QRCode from 'qrcode'

const daftarCabang = [
  { nama: 'SPPG Sleman Timur', slug: 'sleman-timur' },
  { nama: 'SPPG Djati Pasundan', slug: 'djati-pasundan' },
  { nama: 'SPPG Cihampelas', slug: 'cihampelas' },
  { nama: 'SPPG Katapang', slug: 'katapang' },
  { nama: 'SPPG Sukahaji', slug: 'sukahaji' },
  { nama: 'SPPG Bandung Berkah', slug: 'bandung-berkah' }
]

const selectedCabangSlug = ref('katapang')
const qrCodeDataUrl = ref('')

const baseUrl = window.location.origin
const targetLink = computed(() => `${baseUrl}/detail/${selectedCabangSlug.value}`)

const generateQR = async () => {
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(targetLink.value, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
  } catch (err) {
    console.error('Gagal generate QR Code:', err)
  }
}

watch(selectedCabangSlug, () => {
  generateQR()
}, { immediate: true })

const downloadQR = () => {
  const link = document.createElement('a')
  link.href = qrCodeDataUrl.value
  link.download = `QRCode-MBG-${selectedCabangSlug.value}.png`
  link.click()
}
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-white max-w-md mx-auto my-6">
    
    <div class="border-b border-slate-800 pb-4">
      <h2 class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
        Generator 6 QR Code Cabang SPPG
      </h2>
      <p class="text-xs text-slate-400 mt-1">Pilih cabang untuk mendownload QR Code unik wilayah tersebut.</p>
    </div>

    <div class="space-y-2">
      <label class="block text-xs font-bold text-cyan-400 uppercase tracking-wider">📍 Pilih Wilayah Cabang</label>
      <select 
        v-model="selectedCabangSlug"
        class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer shadow-inner"
      >
        <option v-for="c in daftarCabang" :key="c.slug" :value="c.slug">{{ c.nama }}</option>
      </select>
    </div>

    <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
      <span class="text-slate-400 font-medium">Link Tujuan QR:</span>
      <p class="text-cyan-300 font-mono text-[11px] break-all select-all">{{ targetLink }}</p>
    </div>

    <div class="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-inner space-y-3">
      <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code Cabang" class="w-48 h-48 object-contain" />
      <span class="text-[11px] font-bold text-slate-800 uppercase tracking-tight">QR Code Resmi MBG SPPG</span>
    </div>

    <button 
      @click="downloadQR"
      class="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold py-3 rounded-xl transition duration-200 text-sm shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center space-x-2"
    >
      <span>📥 DOWNLOAD QR CODE INI</span>
    </button>

  </div>
</template>