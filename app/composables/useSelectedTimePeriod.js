import {
    endOfDay,
    endOfMonth,
    endOfYear,
    startOfDay,
    startOfMonth,
    startOfYear,
    sub,
} from "date-fns";

export const useSelectedTimePeriod = (period, selectedDate) => {
    const current = computed(() => {
        // Gunakan selectedDate.value, bukan new Date()
        const date = selectedDate.value; 

        switch (period.value) {
            case 'yearly':
                return { start: startOfYear(date), end: endOfYear(date) }
            case 'monthly':
                return { start: startOfMonth(date), end: endOfMonth(date) }
            case 'daily':
                return { start: startOfDay(date), end: endOfDay(date) }
        }
    });
    // const current = computed(() => {
    //     switch (period.value) {
    //         case 'yearly':
    //             return {
    //                 start: startOfYear(new Date()),
    //                 end: endOfYear(new Date()),
    //             }
    //             case 'monthly':
    //                 return {
    //                     start: startOfMonth(new Date()),
    //                     end: endOfMonth(new Date()),
    //                 }
    //                 case 'daily':
    //                 return {
    //                     start: startOfDay(new Date()),
    //                     end: endOfDay(new Date()),
    //             }
    //     }
    // });
    const previous = computed(() => {
        const date = selectedDate.value;
        switch (period.value) {
            case 'yearly':
                return {
                    start: startOfYear(sub(date, { years: 1 })), // startOfYear(new Date()),
                    end: endOfYear(sub(date, { years: 1 })), // endOfYear(new Date()),   
                }
                case 'monthly':
                    return {
                        start: startOfMonth(sub(date, { months: 1 })), // startOfMonth(new Date()),
                        end: endOfMonth(sub(date, { months: 1 })), // endOfMonth(new Date()),
                    }
                    case 'daily':
                    return {
                        start: startOfDay(sub(date, { days: 1 })),
                        // startOfDay(new Date()),
                        end: endOfDay(sub(date, { days: 1 })), 
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