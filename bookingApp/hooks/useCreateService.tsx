import { useState } from 'react';
import { supabase } from '@/utils/supabase';


type Service = {
    id?: number;
    business_id: number;
    name: string;
    description?: string;
    cost: number;
    time_needed: string; // Use string to represent interval
    is_active?: boolean;
};

export function useCreateService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createService = async (service: Omit<Service, 'id'>) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('service')
            .insert([service])
            .single();

        setLoading(false);

        if (error) {
            setError(error.message);
            return { error: error.message };
        }

        return { data };
    };

    return {
        createService,
        loading,
        error,
    };
}