import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
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

export default function EditProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                Alert.alert('Error fetching user data', userError.message);
                return;
            }

            const { data, error }: { data: Profile | null; error: PostgrestError | null } = await supabase
                .from('profiles')
                .select()
                .eq('id', user?.id)
                .single();

            if (error) {
                Alert.alert('Error fetching profile data', error.message);
            } else {
                setProfile(data);
                setFirstName(data?.first_name || '');
                setLastName(data?.last_name || '');
                setPhoneNumber(data?.phone_number || '');
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        if (!profile) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
            })
            .eq('id', profile.id);

        if (error) {
            Alert.alert('Error updating profile', error.message);
        } else {
            Alert.alert('Profile updated successfully');
        }
    };

    return {
        profile,
        loading,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        phoneNumber,
        setPhoneNumber,
        handleUpdateProfile,
    };
}