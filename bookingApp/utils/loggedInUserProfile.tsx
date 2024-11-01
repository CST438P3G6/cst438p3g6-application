import React, { useEffect, useState } from 'react';
import { createClient, PostgrestError } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient('https://qzjdgcbsxquaujrbtluy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6amRnY2JzeHF1YXVqcmJ0bHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMjcxMDQsImV4cCI6MjA0NTgwMzEwNH0.bsGIrdXSs8iojPX94DxK3bXuPrzE0Ojr7WPlFY__2Sc');

// Define the Profile type based on your 'profiles' table structure
type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    isadmin: boolean;
    isprovider: boolean;
    is_active: boolean;
};

type LoggedInUserProfileProps = {
    onDataFetched: (data: Profile | null, error: string | null) => void;
};

export default function LoggedInUserProfile({ onDataFetched }: LoggedInUserProfileProps) {
    useEffect(() => {
        const fetchData = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                onDataFetched(null, userError.message);
                return;
            }

            const { data, error }: { data: Profile | null; error: PostgrestError | null } = await supabase
                .from('profiles')
                .select()
                .eq('id', user?.id)
                .single();

            // Pass data and error back to the parent component
            if (error) {
                onDataFetched(null, error.message);
            } else {
                onDataFetched(data, null);
            }
        };

        fetchData();
    }, [onDataFetched]);

    // Return nothing from this component as it's meant to fetch data
    return null;
}