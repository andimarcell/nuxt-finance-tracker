<script setup>

import { transactionViewsItems } from '~/utils/constants';
const selectedView = ref(transactionViewsItems[1]);

</script>

<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>
        <div>
            <USelectMenu v-model="selectedView" :items="transactionViewsItems" />
        </div>
    </section>
</template>