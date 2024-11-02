import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

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
    useFocusEffect(
        useCallback(() => {
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
        }, [])
    );

    // Return nothing from this component as it's meant to fetch data
    return null;
}