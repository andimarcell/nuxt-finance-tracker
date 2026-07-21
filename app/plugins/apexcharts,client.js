import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Hanya muat dan impor library jika sudah berada di sisi klien (browser)
  if (import.meta.client) {
    const VueApexCharts = (await import('vue3-apexcharts')).default
    nuxtApp.vueApp.use(VueApexCharts)
  }
})