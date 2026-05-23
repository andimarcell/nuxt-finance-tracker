<script setup>
useHead({
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Red+Rose:wght@300..700&display=swap",
    },
  ],
});
</script>

<template>
  <div class="container mx-auto max-w-4xl">
    <Header />
    <main class="my-10">
      <slot />
    </main>
  </div>
</template>

<style></style>
