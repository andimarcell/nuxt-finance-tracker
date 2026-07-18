<script setup>
import { computed } from "vue"

// Menerima data transaksi langsung dari dashboard.vue sebagai props
const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

// LOGIKA AGREGASI: Mengelompokkan & menjumlahkan nominal transaksi khusus tipe 'expense'
const aggregatedData = computed(() => {
  const summary = {}
  
  props.transactions
    .filter(t => t.type?.toLowerCase() === "expense")
    .forEach(t => {
      // Menyamakan huruf kapital pada nama kategori agar konsisten
      const categoryName = t.category ? t.category.charAt(0).toUpperCase() + t.category.slice(1) : "Lainnya"
      summary[categoryName] = (summary[categoryName] || 0) + Number(t.amount)
    })

  return {
    labels: Object.keys(summary),
    series: Object.values(summary)
  }
})

// Konfigurasi visual ApexCharts
const chartOptions = computed(() => {
  return {
    chart: {
      type: "donut",
      foreColor: "#9ca3af" // Warna teks abu-abu agar serasi dengan dark mode
    },
    labels: aggregatedData.value.labels,
    stroke: {
      show: false // Menghilangkan garis batas antar irisan grafik
    },
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontFamily: "Inter, sans-serif"
    },
    // Konfigurasi warna warni modern khas finansial
    colors: ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "11px",
        fontFamily: "Inter, sans-serif",
        fontWeight: "bold"
      },
      dropShadow: {
        enabled: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Belanja",
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              color: "#9ca3af",
              formatter: function (w) {
                // Menghitung total pengeluaran untuk diletakkan di tengah lingkaran donat
                const totalSum = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                return new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0
                }).format(totalSum)
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
          }).format(val)
        }
      }
    }
  }
})

const series = computed(() => aggregatedData.value.series)
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
      Analisis Pengeluaran
    </h3>
    
    <!-- Render chart murni di sisi klien (ClientOnly) karena ApexCharts membutuhkan objek window browser -->
    <ClientOnly>
      <div v-if="series.length > 0" class="flex justify-center">
        <!-- Komponen pembungkus ApexCharts bawaan dari vue3-apexcharts -->
        <apexchart
          type="donut"
          width="360"
          :options="chartOptions"
          :series="series"
        />
      </div>
      <div v-else class="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
        <UIcon name="i-heroicons-chart-pie" class="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p>Belum ada data transaksi pengeluaran pada periode ini.</p>
      </div>
      
      <!-- Tampilan sementara (skeleton loader) saat library dimuat di browser -->
      <template #fallback>
        <USkeleton class="h-64 w-full rounded-lg" />
      </template>
    </ClientOnly>
  </div>
</template>