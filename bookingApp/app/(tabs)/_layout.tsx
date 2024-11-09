import {Tabs} from 'expo-router';
import {useEffect, useState} from 'react';
import {supabase} from '@/utils/supabase';
import {
  Briefcase,
  Calendar,
  Home,
  Settings,
  Users,
  Building,
  Clock,
} from 'lucide-react-native';

export default function TabLayout() {
  const [isClient, setIsClient] = useState(false);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      if (user) {
        const {data: profile} = await supabase
          .from('profiles')
          .select('isprovider, isadmin')
          .eq('id', user.id)
          .single();

        setIsProvider(profile?.isprovider || false); // ignore this
        setIsClient(!profile?.isprovider && !profile?.isadmin); //ignore this
        console.log(profile);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(client)/home"
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(client)/appointments"
        options={{
          title: 'Appointments',
          tabBarIcon: ({color}) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(client)/business"
        options={{
          title: 'Business',
          tabBarIcon: ({color}) => <Briefcase size={24} color={color} />,
        }}
      />

      {isProvider && (
        <>
          <Tabs.Screen
            name="(provider)/viewAllBuinessesPage" // this needs to be changed
            options={{
              title: 'Profiles',
              tabBarIcon: ({color}) => <Users size={24} color={color} />,
            }}
          />
        </>
      )}

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({color}) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
