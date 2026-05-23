<script setup>
import {
  format,
  addYears,
  addMonths,
  addDays,
  subYears,
  subMonths,
  subDays,
} from "date-fns"; // TAMBAHKAN IMPORT INI
import { transactionViewsItems } from "~/utils/constants";

const selectedView = ref(transactionViewsItems[1]);
// TANGGAL ACUAN: Default-nya hari ini
const referenceDate = ref(new Date());
const isModalOpen = ref(false);
const selectedTransaction = ref(null); // State untuk menyimpan transaksi yang sedang diedit

const onEditClick = (transaction) => {
  selectedTransaction.value = transaction; // Set transaksi yang akan diedit
  isModalOpen.value = true; // Buka modal
};

const onAddClick = () => {
  selectedTransaction.value = null; // Pastikan tidak ada transaksi yang dipilih
  isModalOpen.value = true; // Buka modal untuk tambah transaksi baru
};

// Kirim referenceDate ke composable
const { current, previous } = useSelectedTimePeriod(
  selectedView,
  referenceDate,
);
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

// Fungsi untuk navigasi
const nextPeriod = () => {
  if (selectedView.value === "tahunan")
    referenceDate.value = addYears(referenceDate.value, 1);
  if (selectedView.value === "bulanan")
    referenceDate.value = addMonths(referenceDate.value, 1);
  if (selectedView.value === "harian")
    referenceDate.value = addDays(referenceDate.value, 1);
};

const prevPeriod = () => {
  if (selectedView.value === "tahunan")
    referenceDate.value = subYears(referenceDate.value, 1);
  if (selectedView.value === "bulanan")
    referenceDate.value = subMonths(referenceDate.value, 1);
  if (selectedView.value === "harian")
    referenceDate.value = subDays(referenceDate.value, 1);
};

// Judul dinamis untuk navigasi (Misal: "May 2026" atau "2025")
const periodLabel = computed(() => {
  if (selectedView.value === "tahunan")
    return format(referenceDate.value, "yyyy");
  if (selectedView.value === "bulanan")
    return format(referenceDate.value, "MMMM yyyy");
  return format(referenceDate.value, "d MMMM yyyy");
});

// Menentukan apakah kondisi keuangan sedang "Tekor" (Defisit)
// 1. Logika Warna Income: Merah jika pemasukan turun dibanding periode lalu
const incomeStatusColor = computed(() => {
  return incomeTotal.value < previousIncomeTotal.value
    ? "text-red-600 dark:text-red-400"
    : "text-green-600 dark:text-green-400";
});

// 2. Logika Warna Expense: Merah jika pengeluaran naik (boros) dibanding periode lalu
// ATAU jika pengeluaran sudah melebihi pendapatan (defisit)
const expenseStatusColor = computed(() => {
  const isSpendingMore = expenseTotal.value > previousExpenseTotal.value;
  const isOverBudget = expenseTotal.value > incomeTotal.value;

  return isSpendingMore || isOverBudget
    ? "text-red-600 dark:text-red-400"
    : "text-green-600 dark:text-green-400";
});

// 3. Logika Warna Savings: Merah jika tabungan berkurang atau jika minus (tekor)
const savingsStatusColor = computed(() => {
  const isDecreasing = savingsTotal.value < previousSavingsTotal.value;
  const isNegative = savingsTotal.value < 0;

  return isDecreasing || isNegative
    ? "text-red-600 dark:text-red-400"
    : "text-green-600 dark:text-green-400";
});

// 4. Logika Warna Cash on Hand: Merah hanya jika saldo total di database minus
const cashColor = computed(() => {
  return balanceTotal.value < 0
    ? "text-red-600 dark:text-red-400"
    : "text-green-600 dark:text-green-400";
});
</script>

<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <div class="flex items-center space-x-2 mt-2">
        <UButton
          icon="i-heroicons-chevron-left"
          variant="ghost"
          @click="prevPeriod"
        />
        <span class="font-bold text-lg min-w-32 text-center">{{
          periodLabel
        }}</span>
        <UButton
          icon="i-heroicons-chevron-right"
          variant="ghost"
          @click="nextPeriod"
        />
      </div>
    </div>
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
      :color="incomeStatusColor"
    />
    <Trend
      title="Expenses"
      :amount="expenseTotal"
      :lastAmount="previousExpenseTotal"
      :loading="isLoading"
      :color="expenseStatusColor"
    />
    <Trend
      title="Savings"
      :amount="savingsTotal"
      :lastAmount="previousSavingsTotal"
      :loading="isLoading"
      :color="savingsStatusColor"
    />
    <Trend
      title="Cash on Hand"
      :amount="balanceTotal"
      :lastAmount="previousBalanceTotal"
      :loading="isLoading"
      :color="cashColor"
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
        :transaction="selectedTransaction"
        :currentBalance="balanceTotal"
      />
      <UButton
        icon="i-heroicons-plus-circle"
        color="neutral"
        variant="outline"
        class="cursor-pointer"
        label="Add Transaction"
        @click="onAddClick"
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
        @edit="onEditClick(transaction)"
        @delete="refreshTransactions()"
      />
    </div>
  </section>
  <section v-if="isLoading && transactions.length === 0">
    <USkeleton v-for="i in 3" :key="i" class="h-8 w-full rounded-md mb-2" />
  </section>
</template>
