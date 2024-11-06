import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

type Appointment = {
    id: number;
    service_id: number;
    start_time: string;
    end_time: string;
    status: string;
    user_id: string;
    cost: number;
};

export function useViewUserAppointments(userId: string) {
    const [appointments, setAppointments] = useState<Appointment[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('appointment')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                setError(error.message);
                setAppointments(null);
            } else {
                // @ts-ignore
                setAppointments(data);
            }

            setLoading(false);
        };

        if (userId) {
            fetchAppointments();
        }
    }, [userId]);

    return { appointments, loading, error };
}