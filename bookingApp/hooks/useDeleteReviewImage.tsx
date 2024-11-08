import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useDeleteReviewImage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteImage = async (imageId: number): Promise<{ data: any | null, error: string | null }> => {
        setLoading(true);
        setError(null);

        try {
            const { data: imageData, error: fetchError } = await supabase
                .from('review_images')
                .select('image_url')
                .eq('id', imageId)
                .single();

            if (fetchError) {
                setError(fetchError.message);
                return { data: null, error: fetchError.message };
            }

            // @ts-ignore
            const imageUrl = imageData.image_url;
            const imagePath = imageUrl.split('/').slice(-2).join('/');

            const { error: storageError } = await supabase
                .storage
                .from('images')
                .remove([imagePath]);

            if (storageError) {
                setError(storageError.message);
                return { data: null, error: storageError.message };
            }

            const { data, error } = await supabase
                .from('review_images')
                .delete()
                .eq('id', imageId);

            if (error) {
                setError(error.message);
                return { data: null, error: error.message };
            }

            setLoading(false);
            return { data, error: null };

        } catch (e) {
            setError("An unexpected error occurred.");
            setLoading(false);
            return { data: null, error: "An unexpected error occurred." };
        } finally {
            setLoading(false);
        }
    };

    return { deleteImage, loading, error };
}