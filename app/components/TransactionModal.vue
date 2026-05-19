<script setup>
const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const isModalOpen = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <UModal
    v-model:open="isModalOpen"
    title="Add Transaction"
    :dismissible="false"
    :close="{ color: 'neutral', variant: 'ghost', class: 'cursor-pointer' }"
  >
      <template #body>
        <Placeholder class="h-48" />
        <TransactionForm @submit="isModalOpen = false" />
      </template>
       <template #footer>
      <div class="flex justify-end gap-2">
         <UButton label="Cancel" color="neutral" variant="ghost" @click="isModalOpen = false" />
         <!-- tombol save bisa di dalam TransactionForm biar bisa langsung submit -->
      </div>
    </template>
  </UModal>
</template>
