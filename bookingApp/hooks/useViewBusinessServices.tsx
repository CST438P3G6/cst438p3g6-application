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

export function useViewBusinessServices(businessId: number) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('service')
                .select('*')
                .eq('business_id', businessId);

            setLoading(false);

            if (error) {
                setError(error.message);
            } else {
                setServices(data as unknown as Service[]);
            }
        };

        if (businessId) {
            fetchServices();
        }
    }, [businessId]);

    return {
        services,
        loading,
        error,
    };
}