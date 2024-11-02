import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

// Define the Business type based on your 'business' table structure
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

export function useAllBusinesses() {
    const [businesses, setBusinesses] = useState<Business[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('business').select('*');

            if (error) {
                setError(error.message);
                setBusinesses(null);
            } else {
                // @ts-ignore
                setBusinesses(data as Business[]);
                setError(null);
            }
            setLoading(false);
        };

        fetchBusinesses();
    }, []);

    return { businesses, loading, error };
}