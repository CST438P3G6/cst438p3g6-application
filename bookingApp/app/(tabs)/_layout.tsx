import {Tabs} from 'expo-router';
import {useEffect, useState} from 'react';
import {supabase} from '@/utils/supabase';
import {Home, Calendar, Settings, Users} from 'lucide-react-native';

export default function TabLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    checkUserRole();

    const subscription = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'profiles'},
        (payload) => {
          console.log('Realtime update received:', payload);
          if (payload.new) {
            const {id, isadmin, isprovider} = payload.new;
            supabase.auth.getUser().then(({data: {user}}) => {
              if (user && user.id === id) {
                setIsAdmin(isadmin || false);
                setIsProvider(isprovider || false);
              }
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const checkUserRole = async () => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      if (user) {
        const {data: profile} = await supabase
          .from('profiles')
          .select('isadmin, isprovider')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.isadmin || false);
        setIsProvider(profile?.isprovider || false);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const tabScreens = [
    <Tabs.Screen
      key="home"
      name="(client)/home"
      options={{
        title: 'Home',
        tabBarIcon: ({color}) => <Home size={24} color={color} />,
      }}
    />,
    <Tabs.Screen
      key="appointments"
      name="(client)/appointments"
      options={{
        title: 'Appointments',
        tabBarIcon: ({color}) => <Calendar size={24} color={color} />,
      }}
    />,
    <Tabs.Screen
      key="business"
      name="(client)/business"
      options={{
        title: 'Business',
        tabBarIcon: ({color}) => <Users size={24} color={color} />,
      }}
    />,
    isAdmin && (
      <Tabs.Screen
        key="viewProfiles"
        name="(admin)/viewProfiles"
        options={{
          title: 'Profiles',
        }}
      />
    ),
    isProvider && (
      <Tabs.Screen
        key="viewAllBusinessesPage"
        name="(provider)/viewAllBusinessesPage"
        options={{
          title: 'Businesses',
          tabBarIcon: ({color}) => <Users size={24} color={color} />,
        }}
      />
    ),
    <Tabs.Screen
      key="settings"
      name="settings"
      options={{
        title: 'Settings',
        tabBarIcon: ({color}) => <Settings size={24} color={color} />,
      }}
    />,
  ].filter(Boolean);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
      }}
    >
      {tabScreens}
    </Tabs>
  );
}
