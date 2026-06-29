<script setup>
import { format } from "date-fns";
import { useTemplateRef, reactive, computed, watch, ref, nextTick } from "vue";
import { z } from "zod";
import { transactionTypes } from "~/utils/constants";

const formRef = useTemplateRef("form");
const textareaRef = ref(null); // Ref untuk mengakses elemen textarea asli

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

// Fungsi cerdas untuk memperbesar tinggi textarea otomatis sesuai jumlah baris ketikan
const autoResize = () => {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = "auto"; // Reset tinggi terlebih dahulu
  el.style.height = el.scrollHeight + "px"; // Set tinggi sesuai tinggi konten di dalamnya
};

// Logic menghitung saldo Yang bisa dipakai
const availableBalance = computed(() => {
  let available = props.currentBalance;

  if (isEditing.value && props.transaction?.type?.toLowerCase() === "expense") {
    available += props.transaction.amount;
  }
  return available;
});

// logika validasi apakah over budget?
const isOverBudget = computed(() => {
  if (state.type !== "expense") return false;
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

// Pantau perubahan modal terbuka
watch(isModalOpen, (val) => {
  if (val) {
    fillForm();
    // Tunggu komponen dirender penuh (nextTick), lalu sesuaikan tinggi textarea
    nextTick(() => {
      autoResize();
    });
  }
});

const clearForm = () => {
  formRef.value?.clear(); // Menghapus pesan error validasi
  state.description = "";
  state.amount = 0;
  state.type = "income";
  state.created_at = format(new Date(), "yyyy-MM-dd");

  // Kembalikan tinggi textarea ke tinggi semula (1 baris) setelah dibersihkan
  nextTick(() => {
    autoResize();
  });
};

// Schema Validasi
const schema = z.object({
  description: z.string().min(1, "Keterangan wajib diisi"),
  amount: z.number().positive("Nominal harus lebih dari 0"),
  type: z.enum(["income", "expense"]),
  created_at: z.string().min(1, "Tanggal wajib diisi"),
});

const state = reactive({
  description: "",
  amount: 0,
  type: "income",
  created_at: format(new Date(), "yyyy-MM-dd"),
});

// Logic Submit
async function onSubmit(event) {
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
      title: "Sukses",
      description: isEditing.value
        ? "Transaksi berhasil diperbarui!"
        : "Transaksi berhasil ditambahkan!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    isModalOpen.value = false;
    emit("saved");
  } catch (e) {
    toast.add({
      title: "Error",
      description: e.message,
      color: "error",
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
    title="Formulir Transaksi"
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
        <UFormField label="Keterangan" name="description" v-slot="{ error }">
          <!-- MENGGUNAKAN TEXTAREA RESPONSIF: Tanpa scrollbar & tanpa resize-handle -->
          <textarea
            ref="textareaRef"
            v-model="state.description"
            placeholder="Masukkan keterangan..."
            rows="1"
            @input="autoResize"
            :class="[
              'relative block w-full resize-none overflow-hidden focus:outline-none rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm px-3 py-2 border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-150',
              error
                ? 'ring-1 ring-red-400 dark:ring-red-400 border-red-400 dark:border-red-400'
                : 'focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-400 border-gray-300 dark:border-gray-700',
            ]"
          ></textarea>  
        </UFormField>

        <UFormField label="Nominal" name="amount">
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

        <UFormField label="Jenis Transaksi" name="type">
          <USelect
            v-model="state.type"
            :items="transactionTypes"
            option-attribute="label"
            value-attribute="value"
          />
        </UFormField>

        <UFormField label="Tanggal" name="created_at">
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
            :label="isOverBudget ? 'Saldo Tidak Cukup' : 'Simpan Transaksi'"
            :disabled="isOverBudget"
            :color="isOverBudget ? 'red' : 'primary'"
          />
          <UButton variant="outline" @click="clearForm"> Bersihkan </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
