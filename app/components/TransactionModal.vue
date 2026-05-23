<script setup>
import { format } from "date-fns";
import { useTemplateRef, reactive, computed, watch, ref } from "vue";
import { z } from "zod";

const formRef = useTemplateRef("form");
const props = defineProps({
  modelValue: Boolean,
  transaction: Object,
  currentBalance: {
    type: Number,
    default: 0,
  },
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

// Logic menghitung saldo Yang bisa dipakai
const availableBalance = computed(() => {
  let available = props.currentBalance;

  // jika sedang meng-edit sebuah "pengeluaran", kita kembalikan dulu
  // nominal lamanya ke saldo saat ini agar kalkukasinya adil (fair).
  if (isEditing.value && props.transaction?.type?.toLowerCase() === "expense") {
    available += props.transaction.amount;
  }
  return available;
});

// logika validasi apakah over budget?
const isOverBudget = computed(() => {
  // pemasukan (income) tidak pernah over budget
  if (state.type !== "expense") return false;
  // jika pengeluaran lebih besar dari saldo yang tersedia = True (over budget)
  return state.amount > availableBalance.value;
});

// Forma rupiah khusus untuk teks peringatan
const formattedAvailableBalance = computed(() => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(availableBalance.value);
});
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

// Schema Validasi
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

// Logic Submit
async function onSubmit(event) {
  // kemanan ganda jangan eksekusi jika over budget
  if (isOverBudget.value) return;

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
      description: isEditing.value
        ? "Transaction updated!"
        : "Transaction added!",
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

          <!-- peringatan over budget muncul secara reaktif-->
          <div
            v-if="isOverBudget"
            class="flex items-start gap-1 mt-2 text-red-500 dark:text-red-400 text-sm font-medium"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5 shrink-0"
            />
            <p>
              Saldo tidak mencukupi! Sisa saldo yang bisa Anda gunakan hanya
              <strong>{{ formattedAvailableBalance }}</strong>
            </p>
          </div>
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
          <!-- Tombol save akan mati (disabled) jika isOverBudget bernilai true-->
          <UButton
            type="submit"
            :label="isOverBudget ? 'Over Budget' : 'Save Transaction'"
            :disabled="isOverBudget"
            :color="isOverBudget ? 'red' : 'primary'"
          />
          <UButton variant="outline" @click="clearForm"> Clear </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
