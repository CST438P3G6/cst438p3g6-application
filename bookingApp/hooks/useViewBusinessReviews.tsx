import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export function useViewBusinessReviews(businessId: string) {
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
                .eq('business_id', businessId);

            if (error) {
                setError(error.message);
            } else {
                setReviews(data);
            }

            setLoading(false);
        };

        fetchReviews();
    }, [businessId]);

    return { reviews, loading, error };
}