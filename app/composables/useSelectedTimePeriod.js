import {
    endOfDay,
    endOfMonth,
    endOfYear,
    startOfDay,
    startOfMonth,
    startOfYear,
    sub,
} from "date-fns";

export const useSelectedTimePeriod = (period) => {
    const current = computed(() => {
        switch (period.value) {
            case 'yearly':
                return {
                    start: startOfYear(new Date()),
                    end: endOfYear(new Date()),
                }
                case 'monthly':
                    return {
                        start: startOfMonth(new Date()),
                        end: endOfMonth(new Date()),
                    }
                    case 'daily':
                    return {
                        start: startOfDay(new Date()),
                        end: endOfDay(new Date()),
                }
        }
    });
    const previous = computed(() => {
        switch (period.value) {
            case 'yearly':
                return {
                    start: startOfYear(sub(new Date(), { years: 1 })), // startOfYear(new Date()),
                    end: endOfYear(sub(new Date(), { years: 1 })), // endOfYear(new Date()),   
                }
                case 'monthly':
                    return {
                        start: startOfMonth(sub(new Date(), { months: 1 })), // startOfMonth(new Date()),
                        end: endOfMonth(sub(new Date(), { months: 1 })), // endOfMonth(new Date()),
                    }
                    case 'daily':
                    return {
                        start: startOfDay(sub(new Date(), { days: 1 })),
                        // startOfDay(new Date()),
                        end: endOfDay(sub(new Date(), { days: 1 })), 
                         // endOfDay(new Date()),
                }
        }
    });

    return {
        current,
        previous
    }
    const yesterday = sub(today, { days: 1 });
    const lastMonth = sub(today, { months: 1 });
    const lastYear = sub(today, { years: 1 });
}