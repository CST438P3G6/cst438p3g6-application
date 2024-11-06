import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useAddFavorite() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addFavorite = async (userId: string, businessId: number) => {
        setLoading(true);
        const { error } = await supabase
            .from('favorites')
            .insert([{ user_id: userId, business_id: businessId }]);

        if (error) {
            setError(error.message);
        } else {
            setError(null);
        }
        setLoading(false);
    };

    return { addFavorite, loading, error };
}