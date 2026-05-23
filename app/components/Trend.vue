<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
});

const { amount } = toRefs(props);

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

const percentageTrend = computed(() => {
  if (props.lastAmount === 0 || props.amount === 0) return "0%"; // Avoid division by zero
  if (props.lastAmount === 0) return "100%"; // Kalau bulan lalu 0, sekarang ada isi, artinya tumbuh 100% (dari nol)
  // Rumus Standar Finansial: ((Sekarang - Lalu) / Absolut(Lalu)) * 100
  const step = props.amount - props.lastAmount;
  const ratio = (step / Math.abs(props.lastAmount)) * 100;

  return `${Math.round(Math.abs(ratio))}%`;
  // const bigger = Math.max(props.amount, props.lastAmount);
  // const lower = Math.min(props.amount, props.lastAmount);
  // Dibagi lower (karena lower adalah base pembanding untuk nyari selisih)
  // const ratio = ((bigger - lower) / lower) * 100;

  // console.log('bigger', bigger,' lower', lower,' ratio', ratio, Math.round(ratio));
  // return `${Math.round(ratio)}%`;
});

// LOGIKA WARNA:
// Jika ada prop 'color' dari parent, pakai itu.
// Jika tidak ada, pakai logika trending (hijau jika naik, merah jika turun).
const trendColor = computed(() => {
  if (props.color) return props.color; // Prioritas warna dari parent

  return trendingUp.value
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
});

const { currency } = useCurrency(amount);
</script>

<template>
  <div>
    <div class="font-bold text-sm sm:text-base" :class="trendColor">{{ title }}</div>
    <div class="text-xl sm:text-2xl font-extrabold text-black dark:text-white mb-2 truncate">
      <USkeleton class="h-8 w-full" v-if="loading" />

      <!-- Kita pakai ClientOnly buat ngehindarin error merah (Hydration mismatch) -->
      <ClientOnly v-else>
        <!-- Flex items-start bikin teks sejajar di atas -->
        <div class="flex items-start">
          <span>{{ currency.main }}</span>
          <!-- sup bikin teks naik, text-sm ngecilin ukurannya -->
          <sup class="text-xs sm:text-sm font-semibold ml-0.5 mt-1 opacity-70">{{
            currency.fraction
          }}</sup>
        </div>

        <!-- Tulisan Loading sementara (optional) -->
        <template #fallback>
          <USkeleton class="h-8 w-3/4" />
        </template>
      </ClientOnly>
    </div>
    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex items-center space-x-1 text-sm">
        <UIcon :name="icon" class="h-6 w-6" :class="trendColor" />
        <span class="text-gray-500 dark:text-gray-400 truncate">
          {{ percentageTrend }} dari periode lalu
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
