<script setup>
const success = ref(false);
const email = ref("");
const isLoading = ref(false);
const supabase = useSupabaseClient();
const toast = useToast();

const user = useSupabaseUser();

watch(user, (user) => { 
    if (user) {
        return navigateTo("/"); // Redirect ke homepage jika sudah login
    }
}, { immediate: true } // Jalankan watch saat komponen pertama kali di-mount
);
// Pastikan user yang sudah login tidak bisa masuk ke halaman ini lagi
definePageMeta({
  layout: 'default' // atau layout khusus auth jika punya
});

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        // Ganti dengan URL domain kamu nanti saat deploy
        emailRedirectTo: 'http://localhost:3000/', 
      }
    });

    if (error) throw error;
    toast.add({
        title: "Check your email",
        description: `We've sent a login link to ${email.value}. Please check your inbox.`,
        color: "success",
        icon: "i-heroicons-check-circle"
    })
    success.value = true;
  } catch (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle"
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-20">
    <UCard v-if="!success">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Sign in to FTracker
          </h3>
        </div>
      </template>

      <!-- Menggunakan UForm agar enter key otomatis submit -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <UFormField
          label="Email"
          required
          name="email"
          class="mb-4"
          help="Kami akan mengirimkan magic link ke email kamu untuk login."
        >
          <UInput 
            type="email" 
            placeholder="email@contoh.com" 
            v-model="email" 
            icon="i-heroicons-envelope"
            :loading="isLoading"
          />
        </UFormField>

        <UButton 
          type="submit" 
          color="neutral" 
          variant="solid" 
          block
          :loading="isLoading"
        >
          Send Magic Link
        </UButton>
      </form>
    </UCard>

    <UCard v-else class="text-center">
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Email has been sent.
        </h3>
      </template>
      <div class="text-center space-y-4">
        <UIcon name="i-heroicons-paper-airplane" class="w-12 h-12 text-primary mx-auto" />
        <p class="text-gray-500 dark:text-gray-400">
          Silakan cek email <strong>{{ email }}</strong> untuk mengonfirmasi login kamu.
        </p>
        <UButton variant="ghost" @click="success = false">
          Back to login
        </UButton>
      </div>
    </UCard>
  </div>
</template>