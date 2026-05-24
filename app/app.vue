<script setup>
// Domain Vercel resmi kamu
const siteUrl = 'https://pelacak-keuangan-mulia.vercel.app';

// Konfigurasi Head & Favicon
useHead({
  title: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicon.ico'
    }
  ]
})

// Konfigurasi SEO & Open Graph
useSeoMeta({
  title: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  description: 'FTracker membantu Anda mencatat pemasukan, mengawasi pengeluaran, dan mengontrol sisa saldo secara otomatis agar Anda bisa menabung dengan lebih baik.',
  
  // Menggunakan preview-mobile.jpg (Format .jpg didukung penuh & ukuran file sangat ringan)
  ogTitle: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  ogDescription: 'Kelola dan awasi pengeluaran harian Anda secara otomatis menggunakan sistem analisis keuangan cerdas dan responsif.',
  ogImage: `${siteUrl}/preview-mobile.jpg`, 
  ogImageWidth: 300,
  ogImageHeight: 600,
  ogType: 'website',
  ogUrl: siteUrl,
  
  // Twitter Card
  twitterCard: 'summary',
  twitterTitle: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  twitterDescription: 'Kelola dan awasi pengeluaran harian Anda secara otomatis.',
  twitterImage: `${siteUrl}/preview-mobile.jpg`,
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>