<script setup>
const props = defineProps({
  transaction: Object,
});
const { currency: amount } = useCurrency(props.transaction.amount);

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
      onSelect: () => console.log("Delete"),
    },
  ],
];
</script>

<template>
  <div class="grid grid-cols-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-arrow-up-right" class="text-green-500" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="neutral" variant="outline">{{ transaction.type }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
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
