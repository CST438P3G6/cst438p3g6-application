import { supabase } from '@/utils/supabase';
import { PostgrestError } from '@supabase/supabase-js';

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

export async function fetchAllBusinesses(): Promise<{ data: Business[] | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
        .from('business')
        .select('*');

    return { data: data as Business[] | null, error };
}