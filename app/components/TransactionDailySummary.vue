<script setup>
const props = defineProps({
  date: String,
  transaction: Array,
});

const total = computed(() => {
  let total = 0;
  for(const transaction of props.transaction) {
    if (transaction.type === "income") {
      total += transaction.amount;
    } else {
      total -= transaction.amount;
    }
  }
  return total;
});

const { currency: amount } = useCurrency(total);
</script>

<template>
  <div class="grid grid-cols-2 space-y-2 border-b border-gray-800 py-2 mt-2">
    <div class="flex items-center justify-between">
    {{ date }}
    </div>
    <div class="flex items-center justify-end mb-1">
      <!-- Flex items-start bikin teks sejajar di atas -->
      <div class="flex items-start">
        <span class="text-md">{{ amount.main }}</span>
        <!-- sup bikin teks naik, text-sm ngecilin ukurannya -->
        <sup class="text-[0.75rem] font-semibold ml-0.5 mt-3 opacity-70">{{
          amount.fraction
        }}</sup>
      </div>
    </div>
  </div>
</template>
