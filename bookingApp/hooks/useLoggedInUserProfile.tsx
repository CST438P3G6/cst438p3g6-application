import { useState, useCallback } from 'react';
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

export function useLoggedInUserProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) {
                    setError(userError.message);
                    setProfile(null);
                    return;
                }

                const { data, error }: { data: Profile | null; error: PostgrestError | null } = await supabase
                    .from('profiles')
                    .select()
                    .eq('id', user?.id)
                    .single();

                if (error) {
                    setError(error.message);
                    setProfile(null);
                } else {
                    setProfile(data);
                    setError(null);
                }
            };

            fetchData();
        }, [])
    );

    return { profile, error };
}
