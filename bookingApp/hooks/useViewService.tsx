import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

type Service = {
    id: number;
    business_id: number;
    name: string;
    description?: string;
    cost: number;
    time_needed: string; // Use string to represent interval
    is_active?: boolean;
};

export function useViewService(serviceId: number) {
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('service')
                .select('*')
                .eq('id', serviceId)
                .single();

            setLoading(false);

            if (error) {
                setError(error.message);
            } else {
                setService(data as unknown as Service);
            }
        };

        if (serviceId) {
            fetchService();
        }
    }, [serviceId]);

    return {
        service,
        loading,
        error,
    };
}