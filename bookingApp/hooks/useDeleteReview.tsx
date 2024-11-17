import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useDeleteReview() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteReview = async (reviewId: string) => {
        setLoading(true);
        setError(null);

        try {
            const { error: deleteReviewError } = await supabase
                .from('reviews')
                .delete()
                .eq('id', reviewId);

            if (deleteReviewError) {
                setError(deleteReviewError.message);
                setLoading(false);
                return;
            }

            setLoading(false);
        } catch (e) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    };

    return { deleteReview, loading, error };
}