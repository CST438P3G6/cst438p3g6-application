import { useState } from 'react';
import { supabase } from '@/utils/supabase';

// Define the Business type based on your 'business' table structure
type Business = {
    id?: string;
    name: string;
    description: string;
    phone_number: string;
    address: string;
    user_id: string;
    is_active: boolean;
    email: string;
};

export function useCreateBusiness() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createBusiness = async (business: Omit<Business, 'user_id'>): Promise<{ data: Business | null, error: string | null }> => {
        setLoading(true);
        setError(null);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            setError(userError.message);
            setLoading(false);
            return { data: null, error: userError.message };
        }

        const businessWithUserId = { ...business, user_id: user?.id };

        const { data, error } = await supabase
            .from('business')
            .insert([businessWithUserId])
            .single();

        if (error) {
            setError(error.message);
            setLoading(false);
            return { data: null, error: error.message };
        }

        setLoading(false);
        return { data: data as Business, error: null };
    };

    return { createBusiness, loading, error };
}
