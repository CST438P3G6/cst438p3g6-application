import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useDeactivateService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deactivateService = async (serviceId: number) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('service')
            .update({ is_active: false })
            .eq('id', serviceId)
            .single();

        setLoading(false);

        if (error) {
            setError(error.message);
            return { error: error.message };
        }

        return { data };
    };

    return {
        deactivateService,
        loading,
        error,
    };
}