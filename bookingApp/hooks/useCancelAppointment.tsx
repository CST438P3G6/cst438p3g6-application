import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useCancelAppointment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancelAppointment = async (appointmentId: number) => {
        setLoading(true);
        setError(null);

        const { error } = await supabase
            .from('appointment')
            .update({ status: 'cancelled' })
            .eq('id', appointmentId);

        if (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    return { cancelAppointment, loading, error };
}