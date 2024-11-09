import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useAddReviewImages() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImages = async (files: File[], reviewId: number): Promise<{ data: any[] | null, error: string | null }> => {
        setLoading(true);
        setError(null);
        const uploadedData = [];

        try {
            for (const file of files) {
                const path = `review_images/${Date.now()}_${file.name}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(path, file);

                if (uploadError) {
                    setError(uploadError.message);
                    return { data: null, error: uploadError.message };
                }


                const { data: publicUrlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(path);

                const imageUrl = publicUrlData?.publicUrl;

                if (!imageUrl) {
                    setError("Failed to retrieve public URL for the uploaded image.");
                    return { data: null, error: "Failed to retrieve public URL." };
                }


                const { data: insertData, error: insertError } = await supabase
                    .from('review_images')
                    .insert([{ review_id: reviewId, image_url: imageUrl }]);

                if (insertError) {
                    setError(insertError.message);
                    return { data: null, error: insertError.message };
                }

                uploadedData.push(insertData);
            }

            setLoading(false);
            return { data: uploadedData, error: null };

        } catch (e) {
            setError("An unexpected error occurred.");
            setLoading(false);
            return { data: null, error: "An unexpected error occurred." };
        } finally {
            setLoading(false);
        }
    };

    return { uploadImages, loading, error };
}