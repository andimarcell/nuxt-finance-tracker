<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();

// Fungsi untuk logout
const logout = async () => {
  await supabase.auth.signOut();
  navigateTo("/login"); // Redirect ke halaman login setelah logout
};
</script>

<template>
  <header class="flex items-center justify-between mt-10">
    <NuxtLink to="/" class="text-2xl font-bold"> FTracker</NuxtLink>
    <ClientOnly>
      <div v-if="user" class="flex items-center space-x-4">
        <UDropdownMenu
          :items="[
            [
              {
                label: 'Logout',
                icon: 'i-heroicons-arrow-left-on-rectangle',
                onSelect: logout,
              },
            ],
          ]"
        >
          <UAvatar
            :src="user.user_metadata?.avatar_url"
            :alt="user.email"
            class="cursor-pointer"
          />
        </UDropdownMenu>
      </div>
      <div v-else>
        <UButton
          to="/login"
          variant="ghost"
          label="Login"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </UButton>
      </div>
      <!-- Opsional: Kalau lu mau munculin buletan kosong sementara gambarnya di-load -->
      <template #fallback>
        <USkeleton class="h-8 w-8 rounded-full" />
      </template>
    </ClientOnly>
  </header>
</template>
