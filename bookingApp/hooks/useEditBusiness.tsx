import { useState } from 'react';
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

export function useEditBusiness() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const editBusiness = async (business: Business): Promise<{ data: Business | null, error: string | null }> => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('business')
            .update({
                name: business.name,
                description: business.description,
                phone_number: business.phone_number,
                address: business.address,
                is_active: business.is_active,
                email: business.email
            })
            .eq('id', business.id)
            .single();

        if (error) {
            setError(error.message);
            setLoading(false);
            return { data: null, error: error.message };
        }

        setLoading(false);
        return { data: data as Business, error: null };
    };

    return { editBusiness, loading, error };
}