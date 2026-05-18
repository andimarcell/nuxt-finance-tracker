<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
});

const trendingUp = computed(() => props.amount >= props.lastAmount);
const icon = computed(() =>
  trendingUp.value
    ? "i-heroicons:arrow-trending-up"
    : "i-heroicons:arrow-trending-down",
);
const color = computed(() =>
  trendingUp.value
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400",
);
</script>

<template>
  <div>
    <div class="font-bold" :class="color">{{ title }}</div>
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton class="h-8 w-full" v-if="loading" />
      <span v-else>{{ amount }}</span>
    </div>
    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex items-center space-x-1 text-sm">
        <UIcon :name="icon" class="h-6 w-6" :class="color" />
        <span class="text-gray-500 dark:text-gray-400">
          30% from last period
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
