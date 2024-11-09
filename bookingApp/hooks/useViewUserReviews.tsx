import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export function useViewUserReviews(userId: string) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                setError(error.message);
            } else {
                // @ts-ignore
                setReviews(data);
            }

            setLoading(false);
        };

        fetchReviews();
    }, [userId]);

    return { reviews, loading, error };
}