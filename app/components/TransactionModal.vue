<script setup>
import { format } from "date-fns";
import { useTemplateRef, reactive, computed, watch, ref } from "vue";
import { z } from "zod";

const formRef = useTemplateRef("form");
const props = defineProps({
  modelValue: Boolean,
  transaction: Object,
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();
const isLoading = ref(false);

const emit = defineEmits(["update:modelValue", "saved"]);

const isModalOpen = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const isEditing = computed(() => !!props.transaction);

const fillForm = () => {
  if (props.transaction) {
    state.description = props.transaction.description;
    state.amount = props.transaction.amount;
    state.type = props.transaction.type.toLowerCase();
    state.created_at = props.transaction.created_at.split("T")[0]; // Format ke yyyy-MM-dd
  } else {
    clearForm();
  }
};

watch(isModalOpen, (val) => {
  if (val) fillForm();
});

const clearForm = () => {
  formRef.value?.clear(); // Menghapus pesan error validasi
  // Mengembalikan state ke nilai default
  state.description = "";
  state.amount = 0;
  state.type = "income";
  state.created_at = format(new Date(), "yyyy-MM-dd");
};


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
  created_at: format(new Date(), "yyyy-MM-dd"),
});

// 3. Logic Submit
async function onSubmit(event) {
  isLoading.value = true;
  try {
    let error;
    
    if (isEditing.value) {
      const { error: editError } = await supabase
      .from("transactions")
        .update(state)
        .eq("id", props.transaction.id);
      error = editError;
    } else {
      const { error: insertError } = await supabase
      .from("transactions")
      .insert([state]);
      error = insertError;
    }
    if (error) throw error;
      toast.add({
      title: "Success",
      description: isEditing.value ? "Transaction updated!" : "Transaction added!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    isModalOpen.value = false; 
    emit("saved"); 
  } catch (e) {
    toast.add({
      title: "Error",
      description: e.message,
      color: "error", // Gunakan 'error', bukan 'danger' untuk Nuxt UI
      icon: "i-heroicons-x-circle",
    });
  } finally {
    isLoading.value = false;
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
