export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const transactions = ref([]);
  const isLoading = ref(false);
  const allTimeBalance = ref(0);

  const fetchTransactions = async () => {
    if (!user.value) return; // Pastikan user sudah login sebelum fetch data{
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

      const { data: allData, error: allTimeError } = await supabase
        .from("transactions")
        .select("amount, type"); // Kita hanya tarik kolom yang perlu saja biar cepat

      if (allTimeError) throw allTimeError;

      // DI SINI LOGIKANYA:
      // Kita hitung dari nol, lalu iterasi semua data.
      allTimeBalance.value = allData.reduce((acc, transaction) => {
        const type = transaction.type?.toLowerCase();
        const amount = Number(transaction.amount);

        if (type === "income") {
          return acc + amount; // Kalau uang masuk, saldo bertambah
        } else if (type === "expense") {
          return acc - amount; // Kalau uang keluar (expense), saldo BERKURANG
        }
        return acc;
      }, 0);
    } catch (error) {
      console.error("Error:", error);
      transactions.value = [];
    } finally {
      isLoading.value = false;
    }
  };
  // transactions.value = await fetchTransactions();
  watch(
    [period, user],
    () => {
      if (user.value) {
        fetchTransactions();
      } else {
        transactions.value = []; // Reset transaksi jika user logout
        allTimeBalance.value = 0;
      }
    },
    { immediate: true, deep: true },
  );

  const refreshTransactions = async () => {
    await fetchTransactions();
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
    return (transactions.value || [])
      .filter((t) => t.type?.toLowerCase() === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  });

  const expenseTotal = computed(() => {
    return (transactions.value || [])
      .filter((t) => t.type?.toLowerCase() === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  });

  const savingsTotal = computed(() => {
    return incomeTotal.value - expenseTotal.value;
  });

  const balanceTotal = computed(() => {
    return allTimeBalance.value;
  });

  // Gunakan watch pada 'period' langsung

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
