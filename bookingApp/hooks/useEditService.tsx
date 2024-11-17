import { useState } from 'react';
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

export function useEditService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const editService = async (service: Service) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('service')
            .update(service)
            .eq('id', service.id)
            .single();

        setLoading(false);

        if (error) {
            setError(error.message);
            return { error: error.message };
        }

        return { data };
    };

    return {
        editService,
        loading,
        error,
    };
}