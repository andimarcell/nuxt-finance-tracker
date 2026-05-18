<template>
  <header class="flex items-center justify-between mt-10">
    <NuxtLink to="/" class="text-2xl font-bold"> FTracker</NuxtLink>
     <ClientOnly>
      <UAvatar src="https://github.com/andimarcell.png" alt="Avatar" />
      
      <!-- Opsional: Kalau lu mau munculin buletan kosong sementara gambarnya di-load -->
      <template #fallback>
        <USkeleton class="h-8 w-8 rounded-full" />
      </template>
    </ClientOnly>
  </header>
</template>
