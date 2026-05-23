<script setup>
import { computed } from "vue";

const props = defineProps({
  transaction: Object,
});
const emit = defineEmits(["delete", "edit"]);

const amountComputed = computed(() => props.transaction.amount);
const { currency: amount } = useCurrency(amountComputed);

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
const isLoading = ref(false);

const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    await supabase.from("transactions").delete().eq("id", props.transaction.id);
    toast.add({
      title: "Transaction deleted",
      icon: "i-heroicons-check-circle-20-solid",
      color: "success",
    });
    emit("delete", props.transaction.id);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    toast.add({
      title: "Error",
      icon: "i-heroicons-exclamation-circle",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const actions = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square",
      class: "cursor-pointer duration-75",
      onSelect: () => {
        emit("edit", props.transaction);
      },
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
  <div class="grid grid-cols-2 space-y-2 border-b border-gray-800 py-3 mt-2 ">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2 truncate">
        <UIcon :name="icon" :class="[iconColor, 'shrink-0']" />
        <div class="truncate text-sm sm:text-base">{{ transaction.description }}</div>
      </div>
      <div class="shrink-0">
        <UBadge color="neutral" variant="outline" class="text-[10px] sm:text-xs">{{
          transaction.type
        }}</UBadge>
      </div>
    </div>

    <!-- bagian kanan nominal & actions -->
    <div class="flex items-center justify-end space-x-2 mb-1 md:mb-2 shrink-0">
      <!-- Flex items-start bikin teks sejajar di atas -->
      <div class="flex items-start">
        <span class="text-sm sm:text-md">{{ amount.main }}</span>
        <!-- sup bikin teks naik, text-sm ngecilin ukurannya -->
        <sup class="text-[0.65rem] sm:text-[0,75rem] font-semibold ml-0.5 mt-2 sm:mt-3 opacity-70">{{
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
            :loading="isLoading"
          />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>
