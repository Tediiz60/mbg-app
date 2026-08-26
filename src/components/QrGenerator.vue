<script setup lang="ts">
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

interface Cabang {
  nama: string
  slug: string
}

const daftarCabang: Cabang[] = [
  { nama: 'SPPG Bandung Kutawaringin Jatisari', slug: 'kutawaringin-jatisari' },
  { nama: 'SPPG Bandung Soreang Soreang 3', slug: 'soreang-soreang-3' },
  { nama: 'SPPG Bandung Katapang Gandasari 2', slug: 'katapang-gandasari-2' },
  { nama: 'SPPG Kuningan Kadugede Kadugede 2', slug: 'kuningan-kadugede-2' },
  { nama: 'SPPG Kuningan Jalaksana Maniskidul', slug: 'jalaksana-maniskidul' },
  { nama: 'SPPG Bandung Barat Cihampelas Mekarmukti 2', slug: 'cihampelas-mekarmukti-2' }
]

const selectedCabang = ref(daftarCabang[0]?.slug || 'kutawaringin-jatisari')

const qrCodeUrl = computed(() => {
  const targetUrl = `${window.location.origin}/detail/${selectedCabang.value}`
  return targetUrl
})
</script>

<template>
  <div class="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
    <div class="space-y-1">
      <h2 class="text-base font-bold text-cyan-400">Generator QR Code Cabang SPPG</h2>
      <p class="text-xs text-slate-400">Pilih wilayah cabang untuk melihat/download QR Code:</p>
    </div>

    <div>
      <label class="block text-[11px] text-slate-400 mb-1 text-left font-medium">📍 Pilih Wilayah Cabang</label>
      <select v-model="selectedCabang" class="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-xs cursor-pointer focus:outline-none focus:border-cyan-500">
        <option v-for="c in daftarCabang" :key="c.slug" :value="c.slug">{{ c.nama }}</option>
      </select>
    </div>

    <div class="bg-white p-4 rounded-2xl inline-block shadow-lg">
      <QrcodeVue :value="qrCodeUrl" :size="180" level="H" />
    </div>

    <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
      <p class="text-[10px] text-slate-400 mb-0.5">Link Tujuan QR:</p>
      <p class="text-[11px] text-cyan-300 font-mono break-all">{{ qrCodeUrl }}</p>
    </div>
  </div>
</template>