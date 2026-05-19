<script setup>
import { transactionViewsItems } from "~/utils/constants";

const supabase = useSupabaseClient();
const selectedView = ref(transactionViewsItems[1]);
const transactions = ref([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
// const { data, pending } = await useAsyncData("transactions", async () => {
//   const { data, error } = await supabase.from("transactions").select().order("created_at", { ascending: false });
//   if (error) return [];
//   return data;
// });

const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    // Panggil langsung client Supabase, jangan pakai useAsyncData di sini
    const { data, error } = await supabase
      .from("transactions")
      .select()
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  } finally {
    isLoading.value = false;
  }
};
// transactions.value = await fetchTransactions();

const refreshTransactions = async () => {
  transactions.value = await fetchTransactions();
};

await refreshTransactions();

const transactionGroupByDate = computed(() => {
  let grouped = {};

  if (!transactions.value) {
    return grouped;
  }

  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split("T")[0]; // Ambil tanggal saja (YYYY-MM-DD)
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  }
  return grouped;
});

const income = computed(() => {
  return transactions.value.filter(
    (transaction) => transaction.type === "income",
  );
});
const expense = computed(() => {
  return transactions.value.filter(
    (transaction) => transaction.type === "expense",
  );
});

const incomeTotal = computed(() => {
  return income.value.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
});
const expenseTotal = computed(() => {
  return expense.value.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
});

const savingsTotal = computed(() => {
  const now = new Date();
  return transactions.value
    .filter((t) => {
      const date = new Date(t.created_at);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, t) => {
      return t.type === "Income"
        ? acc + Number(t.amount)
        : acc - Number(t.amount);
    }, 0);
});

const balanceTotal = computed(() => {
  return transactions.value.reduce((acc, t) => {
    return t.type === "income"
      ? acc + Number(t.amount)
      : acc - Number(t.amount);
  }, 0);
});

// console.log( transactionGroupByDate.value);
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
    <Trend
      title="Income"
      :amount="incomeTotal"
      :lastAmount="500"
      :loading="isLoading"
    />
    <Trend
      title="Expenses"
      :amount="expenseTotal"
      :lastAmount="3000"
      :loading="isLoading"
      :color="savingsTotal < 0 ? 'text-red-500' : 'text-green-500'"
    />
    <Trend
      title="Savings"
      :amount="savingsTotal"
      :lastAmount="1500"
      :loading="isLoading"
    />
    <Trend
      title="Cash on Hand"
      :amount="balanceTotal"
      :lastAmount="500"
      :loading="isLoading"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ income.length }} incomes and {{ expense.length }} expenses
        this period.
      </div>
    </div>
    <div>
      <TransactionModal v-model:modelValue="isModalOpen" @update:modelValue="refreshTransactions" 
      @saved="refreshTransactions"
      />
       <UButton
        icon="i-heroicons-plus-circle"
        color="neutral"
        variant="outline"
        class="cursor-pointer"
        label="Add Transaction"
        @click="isModalOpen = true"
      />
      
    </div>
  </section>

  <section :class="{ 'opacity-50': isLoading, 'transition-opacity': true }">
    <div
      v-for="(transactionOnDay, date) in transactionGroupByDate"
      :key="date"
      class="mb-10"
    >
      <TransactionDailySummary :date="date" :transaction="transactionOnDay" />

      <Transaction
        v-for="(transaction, index) in transactionOnDay"
        :key="index"
        :transaction="transaction"
        @delete="refreshTransactions()"
      />
    </div>
  </section>
  <section v-if="isLoading && transactions.length === 0">
    <USkeleton v-for="i in 3" :key="i" class="h-8 w-full rounded-md mb-2" />
  </section>
</template>
