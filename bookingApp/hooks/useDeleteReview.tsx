import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useDeleteReview() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteReview = async (reviewId: string) => {
        setLoading(true);
        setError(null);

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    return { deleteReview, loading, error };
}