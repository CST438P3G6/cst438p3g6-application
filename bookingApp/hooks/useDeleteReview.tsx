import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useDeleteReviewImage } from '@/hooks/useDeleteReviewImage';

export function useDeleteReview() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { deleteImage } = useDeleteReviewImage();

    const deleteReview = async (reviewId: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data: images, error: fetchError } = await supabase
                .from('review_images')
                .select('id')
                .eq('review_id', reviewId);

            if (fetchError) {
                setError(fetchError.message);
                setLoading(false);
                return;
            }

            for (const image of images) {
                // @ts-ignore
                const { error: deleteImageError } = await deleteImage(image.id);
                if (deleteImageError) {
                    setError(deleteImageError);
                    setLoading(false);
                    return;
                }
            }

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