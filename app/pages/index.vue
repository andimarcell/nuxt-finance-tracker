<script setup>
// Halaman ini tidak butuh logic apa-apa, murni UI
definePageMeta({
  layout: "default",
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-[75vh] text-center px-4"
  >
    <!-- Badge Versi -->
    <UBadge
      color="primary"
      variant="subtle"
      class="mb-6 rounded-full px-3 py-1"
    >
      v1.0 - Skripsi Edition
    </UBadge>

    <!-- Headline Utama -->
    <h1
      class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white"
    >
      Lacak Keuanganmu <br class="hidden md:block" />
      <span class="text-primary">Lebih Cerdas.</span>
    </h1>

    <!-- Sub-Headline -->
    <p
      class="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-10"
    >
      FTracker membantu Anda mencatat pemasukan, mengawasi pengeluaran, dan
      mengontrol sisa saldo secara otomatis agar Anda bisa menabung dengan lebih
      baik.
    </p>

    <!-- Call to Action (CTA) Button -->
    <div class="flex flex-col sm:flex-row items-center gap-4">
      <UButton
        to="/login"
        size="xl"
        color="primary"
        class="px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/30"
        trailing-icon="i-heroicons-arrow-right-20-solid"
      >
        Mulai Sekarang Gratis
      </UButton>
    </div>

    <!-- Mockup Dasbor (Ilustrasi Kotak) -->
    <div
      class="mt-16 w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition hover:scale-[1.02] duration-300"
    >
      <!-- Mac OS Window Header Style -->
      <div
        class="bg-gray-100 dark:bg-gray-900 p-3 border-b border-gray-200 dark:border-gray-800 flex space-x-2"
      >
        <div class="w-3 h-3 rounded-full bg-red-400"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div class="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <!-- Body Mockup -->
      <div
        class="bg-white dark:bg-gray-950 aspect-video flex flex-col items-center justify-center relative p-8"
      >
        <img
          src=""
          alt="Preview Dashboard FTracker"
          class="w-full h-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
  </div>
</template>
