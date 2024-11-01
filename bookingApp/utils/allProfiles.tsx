import React, { useEffect } from 'react';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import {supabase} from "@/utils/supabase";



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

type AllProfilesProps = {
    onDataFetched: (data: Profile[] | null, error: string | null) => void;
};

export default function AllProfiles({ onDataFetched }: AllProfilesProps) {
    useEffect(() => {
        const fetchData = async () => {
            const { data, error }: { data: Profile[] | null; error: PostgrestError | null } = await supabase
                .from('profiles')
                .select();

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