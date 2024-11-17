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
    service: {
        business_id: string;
    };
};

export function useViewBusinessAppointments(businessId: string) {
    const [appointments, setAppointments] = useState<Appointment[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('appointment')
                .select('id, service_id, start_time, end_time, status, user_id, cost, service!inner (business_id)')
                .eq('service.business_id', businessId);

            if (error) {
                setError(error.message);
                setAppointments(null);
            } else {
                // @ts-ignore
                setAppointments(data);
            }

            setLoading(false);
        };

        if (businessId) {
            fetchAppointments();
        }
    }, [businessId]);

    return { appointments, loading, error };
}
