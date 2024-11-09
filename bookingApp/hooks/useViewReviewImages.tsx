import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export function useViewReviewImages(reviewId: number) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('review_images')
                .select('*')
                .eq('review_id', reviewId);

            if (error) {
                setError(error.message);
            } else {
                // @ts-ignore
                setImages(data);
            }

            setLoading(false);
        };

        fetchImages();
    }, [reviewId]);

    return { images, loading, error };
}