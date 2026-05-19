<script setup>
const props = defineProps({
  transaction: Object,
});

const { currency: amount } = useCurrency(props.transaction.amount);

const isIncome = computed(() => props.transaction.type === "income");
const icon = computed(() => {
  if (isIncome.value) {
    return "i-heroicons-arrow-up-right";
  } else {
    return "i-heroicons-arrow-down-left";
  }
});

const iconColor = computed(() => {
  if (isIncome.value) {
    return "text-green-500";
  } else {
    return "text-red-500";
  }
});

const supabase = useSupabaseClient();
const toast = useToast();

const deleteTransaction = async () => {
  try {
    await supabase.from("transactions").delete().eq("id", props.transaction.id);
    toast.add({
      title: "Transaction deleted",
      icon: "i-heroicons-check-circle-20-solid",
      color: "success",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    toast.add({
      title: "Error",
      icon: "i-heroicons-exclamation-triangle-20-solid",
      color: "error",
    });
  }
};

const actions = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square",
      class: "cursor-pointer duration-75",
      onSelect: () => console.log("Edit"),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      class: "cursor-pointer duration-75",
      onSelect: deleteTransaction,
    },
  ],
];
</script>

<template>
  <div class="grid grid-cols-2 space-y-2 border-b border-gray-800 py-2 mt-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="neutral" variant="outline">{{
          transaction.type
        }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2 mb-1">
      <!-- Flex items-start bikin teks sejajar di atas -->
      <div class="flex items-start">
        <span class="text-md">{{ amount.main }}</span>
        <!-- sup bikin teks naik, text-sm ngecilin ukurannya -->
        <sup class="text-[0.75rem] font-semibold ml-0.5 mt-3 opacity-70">{{
          amount.fraction
        }}</sup>
      </div>
      <div>
        <UDropdownMenu
          :items="actions"
          :content="{ side: 'bottom', align: 'end' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="cursor-pointer duration-75"
            trailing-icon="i-heroicons-ellipsis-horizontal"
          />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>
