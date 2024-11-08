import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export function useViewBusinessImages(businessId: string) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('business_images')
                .select('*')
                .eq('business_id', businessId);

            if (error) {
                setError(error.message);
            } else {
                // @ts-ignore
                setImages(data);
            }

            setLoading(false);
        };

        fetchImages();
    }, [businessId]);

    return { images, loading, error };
}