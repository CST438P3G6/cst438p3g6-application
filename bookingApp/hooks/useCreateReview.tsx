import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useCreateReview() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createReview = async (businessId: number, body: string, rating: number, userId: string) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('reviews')
            .insert([{ business_id: businessId, body, rating, user_id: userId }]);

        if (error) {
            setError(error.message);
        }

        setLoading(false);
        return data;
    };

    return { createReview, loading, error };
}