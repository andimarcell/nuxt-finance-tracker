// app/composables/useCurrency.js (atau ditaruh di folder utils sesuai settingan lu)
import { computed, isRef } from 'vue';

export const useCurrency = (amount) => {
    const currency = computed(() => {
        // 1. Format dulu jadi Rp 1.000,00
        const formatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(isRef(amount) ? amount.value : amount);

        // 2. Pecah string berdasarkan tanda koma
        const parts = formatted.split(',');
        
        // 3. Return sebagai Object
        return {
            main: parts[0], // Isinya: "Rp 1.000"
            fraction: parts[1] // Isinya: "00"
        };
    });
    
    return { currency };
};