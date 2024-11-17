import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useDisownBusiness() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const disownBusiness = async (businessId: number) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('business')
            .update({ user_id: null, is_active: false })
            .eq('id', businessId)
            .single();

        setLoading(false);

        if (error) {
            setError(error.message);
            return { error: error.message };
        }

        return { data };
    };

    return {
        disownBusiness,
        loading,
        error,
    };
}