export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient();
  const transactions = ref([]);
  const isLoading = ref(false);

  const fetchTransactions = async () => {
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select()
        .gte("created_at", period.value.start.toISOString())
        .lte("created_at", period.value.end.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      transactions.value = data || [];
    } catch (error) {
      console.error("Error:", error);
      transactions.value = [];
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
    for (const transaction of transactions.value) {
      const date = new Date(transaction.created_at).toISOString().split("T")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(transaction);
    }
    return grouped;
  });

  const income = computed(() => {
    // Tambahkan || [] untuk memberikan fallback array kosong
    return (transactions.value || []).filter(
      (transaction) =>
        transaction.type === "income" || transaction.type === "Income",
    );
  });

  const expense = computed(() => {
    return (transactions.value || []).filter(
      (transaction) =>
        transaction.type === "expense" || transaction.type === "Expense",
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
    // Tambahkan ?. dan || [] agar aman
    return (transactions.value || [])
      .filter((t) => {
        const date = new Date(t.created_at);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((acc, t) => {
        return t.type === "income"
          ? acc + Number(t.amount)
          : acc - Number(t.amount);
      }, 0);
  });

  const balanceTotal = computed(() => {
    // Tambahkan || []
    return (transactions.value || []).reduce((acc, t) => {
      return t.type === "income" || t.type === "Income"
        ? acc + Number(t.amount)
        : acc - Number(t.amount);
    }, 0);
  });

  // Gunakan watch pada 'period' langsung
  watch(period, () => fetchTransactions(), { immediate: true, deep: true });
  return {
    transactions,
    isLoading,
    refreshTransactions: fetchTransactions,
    transactionGroupByDate,
    income,
    expense,
    incomeTotal,
    expenseTotal,
    savingsTotal,
    balanceTotal,
  };
};
