<script setup>
import { useTemplateRef } from "vue";
import { z } from "zod";

const formRef = useTemplateRef("form");
const props = defineProps({
    modelValue: Boolean,
});

const supabase = useSupabaseClient();
const toast = useToast();

const emit = defineEmits(["update:modelValue", "saved"]);

const clearForm = () => {
  formRef.value?.clear(); // Menghapus pesan error validasi
  // Mengembalikan state ke nilai default
  state.description = "";
  state.amount = 0;
  state.type = "Income";
  state.created_at = new Date().toISOString().split("T")[0];
};

// 1. Logic Modal State (v-model)
const isModalOpen = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});


// 2. Schema Validasi
const schema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  created_at: z.string().min(1, "Date is required"),
});

const state = reactive({
  description: "",
  amount: 0,
  type: "income",
  created_at: new Date().toISOString().split("T")[0],
});

// 3. Logic Submit
async function onSubmit(event) {
  const { error } = await supabase.from("transactions").insert([state]);

  if (error) {
    toast.add({ title: "Error", description: error.message, color: "error" });
  } else {
    toast.add({
      title: "Success",
      description: "Transaction added!",
      color: "success",
    });
    isModalOpen.value = false; // Tutup modal
    emit("saved"); // Panggil refresh di index.vue
  }
}
</script>

<template>
  <UModal
    scrollable
    v-model:open="isModalOpen"
    title="Form Transaction"
    :dismissible="false"
    :close="{ color: 'neutral', variant: 'ghost', class: 'cursor-pointer' }"
  >
    <template #body>
      <TransactionForm @submit="isModalOpen = false" />
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Description" name="description">
          <UInput v-model="state.description" placeholder="Description" />
        </UFormField>

        <UFormField label="Amount" name="amount">
          <UInput v-model.number="state.amount" type="number" />
        </UFormField>

        <UFormField label="Type" name="type">
          <USelect v-model="state.type" :items="['income', 'expense']" />
        </UFormField>

        <UFormField label="Date" name="created_at">
          <UInput
            v-model="state.created_at"
            type="date"
            icon="i-heroicons-calendar-20-solid"
          />
        </UFormField>

        <div class="flex justify-between pt-4">
          <UButton type="submit" label="Save Transaction" />
          <UButton variant="outline" @click="clearForm"> Clear </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
