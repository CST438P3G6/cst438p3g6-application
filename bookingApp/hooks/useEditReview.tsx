import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useEditReview() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const editReview = async (reviewId: string, updatedReview: { body: string; rating: number }) => {
        setLoading(true);
        setError(null);

        const { error } = await supabase
            .from('reviews')
            .update(updatedReview)
            .eq('id', reviewId);

        if (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    return { editReview, loading, error };
}