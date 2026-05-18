<script setup>
import { transactionViewsItems } from "~/utils/constants";

const supabase = useSupabaseClient();
const selectedView = ref(transactionViewsItems[1]);
const transactions = ref([]);

const { data, pending } = await useAsyncData("transactions", async () => {
  const { data, error } = await supabase.from("transactions").select();
  if (error) return [];
  return data;
});
transactions.value = data.value;
// const { data, error } = await supabase
//   .from('transactions')
//   .select('amount, type')

// console.log('data', data, 'error', error);
// const { count, error } = await supabase
//   .from('transactions')
//   .select('*', { count: 'exact', head: true })

//   console.log('count', count, 'error', error);

// const { data, error } = await supabase
//   .from("transactions")
//   .select("amount, type")
//   .eq("type", "income");

// console.log("data", data, "error", error);
</script>

<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedView" :items="transactionViewsItems" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10 gap-8"
  >
    <Trend title="Income" :amount="1000" :lastAmount="500" :loading="false" />
    <Trend
      title="Expenses"
      :amount="1000"
      :lastAmount="3000"
      :loading="false"
    />
    <Trend title="Savings" :amount="2000" :lastAmount="1500" :loading="false" />
    <Trend title="Budget" :amount="1000" :lastAmount="500" :loading="true" />
  </section>

  <section>
    <Transaction
      v-for="(transaction, index) in transactions"
      :key="index"
      :transaction="transaction"
    />
  </section>
</template>
