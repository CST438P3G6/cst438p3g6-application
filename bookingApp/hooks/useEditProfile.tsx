import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {PostgrestError} from '@supabase/supabase-js';
import {supabase} from '@/utils/supabase';

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

export default function useEditProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: {user},
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        Alert.alert('Error fetching user data', userError.message);
        return;
      }

      const {
        data,
        error,
      }: {data: Profile | null; error: PostgrestError | null} = await supabase
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
        setIsProvider(data?.isprovider || false);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!profile) return;

    const updates: Partial<Profile> = {};
    if (firstName.trim() !== '' && firstName !== profile.first_name)
      updates.first_name = firstName;
    if (lastName.trim() !== '' && lastName !== profile.last_name)
      updates.last_name = lastName;
    if (phoneNumber.trim() !== '' && phoneNumber !== profile.phone_number)
      updates.phone_number = phoneNumber;
    if (isProvider !== profile.isprovider) updates.isprovider = isProvider;

    if (Object.keys(updates).length === 0) {
      Alert.alert('No changes to update or fields are empty');
      return;
    }

    const {error} = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (error) {
      Alert.alert('Error updating profile', error.message);
    } else {
      setProfile({...profile, ...updates});
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
    isProvider,
    setIsProvider,
    handleUpdateProfile,
  };
}
