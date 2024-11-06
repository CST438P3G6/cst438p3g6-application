import { useState } from 'react';
import { supabase } from '@/utils/supabase';

// Define the BusinessHour type based on your 'business_hours' table structure
type BusinessHour = {
    business_id: string;
    day: string;
    open_time: string;
    close_time: string;
};

export function useUpsertBusinessHours() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const upsertBusinessHours = async (businessHours: BusinessHour[]): Promise<{ data: BusinessHour[] | null, error: string | null }> => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('business_hours')
            .upsert(businessHours, { onConflict: 'business_id,day' });

        if (error) {
            setError(error.message);
            setLoading(false);
            return { data: null, error: error.message };
        }

        setLoading(false);
        return { data: data ? data as BusinessHour[] : null, error: null };
    };

    return { upsertBusinessHours, loading, error };
}