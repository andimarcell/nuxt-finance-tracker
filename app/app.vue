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
  
  // KEMBALI MENGGUNAKAN LANDSCAPE (Sangat disukai WhatsApp & Meta)
  ogTitle: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  ogDescription: 'Kelola dan awasi pengeluaran harian Anda secara otomatis menggunakan sistem analisis keuangan cerdas dan responsif.',
  ogImage: `${siteUrl}/preview-laptop.png`, 
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  ogUrl: siteUrl,
  
  // Twitter Card
  twitterCard: 'summary_large_image',
  twitterTitle: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  twitterDescription: 'Kelola dan awasi pengeluaran harian Anda secara otomatis.',
  twitterImage: `${siteUrl}/preview-laptop.png`,
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>