export const useFetchTransactions = () => {
  const supabase = useSupabaseClient();
  const transactions = ref([]);
  const isLoading = ref(false);

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

    return {
    transactions,
    isLoading,
    refreshTransactions,
    transactionGroupByDate,
    income,
    expense,
    incomeTotal,
    expenseTotal,
    savingsTotal,
    balanceTotal
  };
};
