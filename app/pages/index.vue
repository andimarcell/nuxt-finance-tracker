<script setup>
import { transactionViewsItems } from "~/utils/constants";

const selectedView = ref(transactionViewsItems[1]);
const isModalOpen = ref(false);
const { current, previous } = useSelectedTimePeriod(selectedView);
const {
  transactions,
  isLoading,
  refreshTransactions,
  transactionGroupByDate,
  income,
  expense,
  incomeTotal,
  expenseTotal,
  savingsTotal,
  balanceTotal,
} = useFetchTransactions(current);

const {
  refreshTransactions: refreshPreviousTransactions,
  incomeTotal: previousIncomeTotal,
  expenseTotal: previousExpenseTotal,
  savingsTotal: previousSavingsTotal,
  balanceTotal: previousBalanceTotal,
} = useFetchTransactions(previous);

await refreshTransactions();
await refreshPreviousTransactions();

// Logika warna untuk Expenses: 
// Merah jika pengeluaran > pendapatan, Hijau jika pengeluaran <= pendapatan
const expenseColor = computed(() => {
  return expenseTotal.value > incomeTotal.value 
    ? 'text-red-500' 
    : 'text-green-500'
});

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
      :lastAmount="previousIncomeTotal"
      :loading="isLoading"
    />
    <Trend
      title="Expenses"
      :amount="expenseTotal"
      :lastAmount="previousExpenseTotal"
      :loading="isLoading"
      :color="expenseColor"
    />
    <Trend
      title="Savings"
      :amount="savingsTotal"
      :lastAmount="previousSavingsTotal"
      :loading="isLoading"
    />
    <Trend
      title="Cash on Hand"
      :amount="balanceTotal"
      :lastAmount="previousBalanceTotal"
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
      <TransactionModal
        v-model:modelValue="isModalOpen"
        @update:modelValue="refreshTransactions"
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

  <section
    :key="selectedView"
    :class="{ 'opacity-50': isLoading, 'transition-opacity': true }"
  >
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
