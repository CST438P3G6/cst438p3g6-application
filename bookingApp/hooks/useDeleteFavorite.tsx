import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useDeleteFavorite() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteFavorite = async (userId: string, businessId: number) => {
        setLoading(true);
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('business_id', businessId);

        if (error) {
            setError(error.message);
        } else {
            setError(null);
        }
        setLoading(false);
    };

    return { deleteFavorite, loading, error };
}