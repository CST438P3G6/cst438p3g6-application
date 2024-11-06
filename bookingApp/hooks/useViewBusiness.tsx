import { useState, useEffect } from 'react';
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

export function useViewBusiness(businessId: string) {
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusiness = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('business')
                .select('*')
                .eq('id', businessId)
                .single();

            if (error) {
                setError(error.message);
            } else {
                setBusiness(data as unknown as Business);
            }
            setLoading(false);
        };

        if (businessId) {
            fetchBusiness();
        }
    }, [businessId]);

    return { business, loading, error };
}