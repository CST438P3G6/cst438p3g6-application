import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

type Favorite = {
    business_id: number;
    user_id: string;
};

export function useUserFavorites(userId: string) {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                setError(error.message);
            } else {
                setFavorites(data as unknown as Favorite[]);
            }
            setLoading(false);
        };

        if (userId) {
            fetchFavorites();
        }
    }, [userId]);

    return { favorites, loading, error };
}