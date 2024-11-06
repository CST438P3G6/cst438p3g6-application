import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

type AvailableTimeSlot = {
    day: string;
    slot_start: string;
    slot_end: string;
};

export function useAvailableTimeSlots(
    businessId: number,
    startDate: string,
    endDate: string,
    serviceDuration: number,
    slotStartInterval: number
) {
    const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTimeSlot[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvailableTimeSlots = async () => {
            setLoading(true);
            const { data, error } = await supabase.rpc('get_available_slots', {
                function_business_id: businessId,
                start_date: startDate,
                end_date: endDate,
                service_duration: serviceDuration,
                slot_start_interval: slotStartInterval
            });

            if (error) {
                setError(error.message);
            } else {
                setAvailableTimeSlots(data as AvailableTimeSlot[]);
            }
            setLoading(false);
        };

        if (businessId && startDate && endDate && serviceDuration && slotStartInterval) {
            fetchAvailableTimeSlots();
        }
    }, [businessId, startDate, endDate, serviceDuration, slotStartInterval]);

    return { availableTimeSlots, loading, error };
}