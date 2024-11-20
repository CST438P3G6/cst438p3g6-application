import {Stack} from 'expo-router';
import {useEffect} from 'react';
import {useRouter} from 'expo-router';
import {useUser} from '@/context/UserContext';

export default function AdminLayout() {
  const {profile} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (profile && !profile.isadmin) {
      router.replace('/(tabs)/home');
    }
  }, [profile]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#000',
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Admin Dashboard',
        }}
      />
      <Stack.Screen
        name="viewProfiles"
        options={{
          title: 'User Profiles',
        }}
      />
    </Stack>
  );
}
