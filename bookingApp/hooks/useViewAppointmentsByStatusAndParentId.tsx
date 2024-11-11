import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useViewAppointmentsByStatusAndParentId() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [appointments, setAppointments] = useState<any[]>([]);

    const fetchAppointments = async (status: string, id: string, parentTable: 'user_id' | 'service_id' | 'business_id') => {
        setLoading(true);
        setError(null);
        setAppointments([]);

        try {
            let query = supabase.from('appointment').select('*').eq('status', status);

            if (parentTable === 'user_id') {
                query = query.eq('user_id', id);
            } else if (parentTable === 'service_id') {
                query = query.eq('service_id', id);
            } else if (parentTable === 'business_id') {
                const { data: services, error: serviceError } = await supabase
                    .from('service')
                    .select('id')
                    .eq('business_id', id);

                if (serviceError) throw new Error(serviceError.message);

                const serviceIds = services.map((service: any) => service.id);
                query = query.in('service_id', serviceIds);
            }

            const { data, error: appointmentError } = await query;

            if (appointmentError) throw new Error(appointmentError.message);

            setAppointments(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return { fetchAppointments, appointments, loading, error };
}