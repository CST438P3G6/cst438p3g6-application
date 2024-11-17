import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

type BusinessHour = {
    business_id: string;
    day: string;
    open_time: string;
    close_time: string;
};

export function useViewBusinessHours(businessId: string) {
    const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusinessHours = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('business_hours')
                .select('*')
                .eq('business_id', businessId);

            if (error) {
                setError(error.message);
            } else {
                setBusinessHours(data as unknown as BusinessHour[]);
            }
            setLoading(false);
        };

        if (businessId) {
            fetchBusinessHours();
        }
    }, [businessId]);

    return { businessHours, loading, error };
}