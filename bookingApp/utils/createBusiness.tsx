import { supabase } from '@/utils/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Define the Business type based on your 'businesses' table structure
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

export async function upsertBusiness(business: Omit<Business, 'user_id'>): Promise<{ data: Business | null; error: PostgrestError | null }> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        return { data: null, error: userError };
    }

    const businessWithUserId = { ...business, user_id: user?.id };

    const { data, error } = await supabase
        .from('business')
        .upsert([businessWithUserId], { onConflict: 'id' })
        .single();

    return { data, error };
}