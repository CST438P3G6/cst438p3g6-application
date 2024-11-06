import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useConfirmAppointment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const confirmAppointment = async (appointmentId: number) => {
        setLoading(true);
        setError(null);

        const { error } = await supabase
            .from('appointment')
            .update({ status: 'confirmed' })
            .eq('id', appointmentId);

        if (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    return { confirmAppointment, loading, error };
}