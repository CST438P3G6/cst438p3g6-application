import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

type Business = {
    id: string;
    name: string;
    description: string;
    phone_number: string;
    address: string;
    user_id: string;
    is_active: boolean;
    email: string;
};

export function useUserBusinesses(userId: string | null) {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!userId) return;

            setLoading(true);
            const { data, error } = await supabase
                .from('business')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                setError(error.message);
                setBusinesses([]);
            } else {
                // @ts-ignore
                setBusinesses(data || []);
                setError(null);
            }
            setLoading(false);
        };

        fetchBusinesses();
    }, [userId]);

    return { businesses, loading, error };
}