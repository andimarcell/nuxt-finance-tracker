<script setup>
// Domain Vercel resmi kamu untuk dibaca oleh Crawler WhatsApp/Telegram
const siteUrl = 'https://pelacak-keuangan-mulia.vercel.app';
// Konfigurasi Head & Favicon
useHead({
  title: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  link: [
    // Favicon Standar
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    // Apple Touch Icon (Sangat penting untuk pratinjau perangkat iOS & crawler chat)
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicon.ico'
    }
  ]
})

// Konfigurasi SEO & Open Graph (WhatsApp, Telegram, Discord, Facebook)
useSeoMeta({
  title: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  description: 'FTracker membantu Anda mencatat pemasukan, mengawasi pengeluaran, dan mengontrol sisa saldo secara otomatis agar Anda bisa menabung dengan lebih baik.',
  
  // Open Graph Facebook / WhatsApp / Telegram
  ogTitle: 'FTracker - Lacak Keuanganmu Lebih Cerdas',
  ogDescription: 'Kelola dan awasi pengeluaran harian Anda secara otomatis menggunakan sistem analisis keuangan cerdas dan responsif.',
  ogImage: `${siteUrl}/preview-laptop.png`, // Menggunakan gambar laptop mockup yang mewah sebagai preview
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
