<template>
  <div class="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
    
    <!-- CARD LEFT: QR GENERATOR -->
    <div class="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl h-full relative overflow-hidden">
      <div class="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold mb-3">
        📌 Barcode Cetak Menu
      </span>
      <h2 class="text-xl font-bold text-white mb-1">QR Code Menu MBG</h2>
      <p class="text-xs text-slate-400 mb-4 max-w-xs">Arahkan kamera ke QR Code ini untuk membuka rincian gizi makanan</p>

      <div class="p-4 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/30">
        <qrcode-vue :value="sampleUrl" :size="180" level="H" />
      </div>

      <div class="mt-4 px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 break-all max-w-full">
        Target: {{ sampleUrl }}
      </div>
    </div>

    <!-- CARD RIGHT: CAMERA SCANNER -->
    <div class="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl h-full">
      <h2 class="text-xl font-bold text-white mb-1">Pindai Barcode Kemasan</h2>
      <p class="text-xs text-slate-400 mb-4">Gunakan kamera bawaan web untuk melakukan scan</p>

      <div id="reader" class="w-full max-w-sm h-56 sm:h-64 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-slate-950 overflow-hidden flex items-center justify-center"></div>

      <div class="mt-4 w-full max-w-sm">
        <button 
          v-if="!isScanning" 
          @click="startScan" 
          class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/40 transition text-sm flex items-center justify-center gap-2">
          <span>📷</span> Aktifkan Kamera Scanner
        </button>
        
        <button 
          v-else 
          @click="stopScan" 
          class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-900/40 transition text-sm flex items-center justify-center gap-2">
          <span>🛑</span> Tutup Kamera
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Menghilangkan efek mirror pada kamera */
:deep(#reader video) {
  transform: scaleX(-1) !important;
  -webkit-transform: scaleX(-1) !important;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const isScanning = ref(false)
const sampleUrl = ref('')
let html5QrCode = null

onMounted(() => {
  sampleUrl.value = `${window.location.origin}/menu/MBG-001`
})

const startScan = async () => {
  isScanning.value = true
  setTimeout(async () => {
    html5QrCode = new Html5Qrcode("reader")
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        onScanSuccess
      )
    } catch (err) {
      alert("Kamera gagal diakses atau izin ditolak.")
      isScanning.value = false
    }
  }, 300)
}

const stopScan = async () => {
  if (html5QrCode && isScanning.value) {
    await html5QrCode.stop()
    html5QrCode.clear()
    isScanning.value = false
  }
}

const onScanSuccess = (decodedText) => {
  stopScan()
  if (decodedText.startsWith('http')) {
    window.location.href = decodedText
  } else {
    router.push(`/menu/${decodedText.trim()}`)
  }
}

onUnmounted(() => {
  if (html5QrCode && isScanning.value) {
    html5QrCode.stop()
  }
})
</script>