import {createContext, useContext, useEffect, useState} from 'react';
import {Session, User} from '@supabase/supabase-js';
import {supabase} from '@/utils/supabase';
import {useRouter, useSegments} from 'expo-router';
import {RealtimeChannel} from '@supabase/supabase-js';

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

type UserContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({children}: {children: React.ReactNode}) {
  const [realtimeChannel, setRealtimeChannel] =
    useState<RealtimeChannel | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
        setRealtimeChannel(null);
      }
      return;
    }

    const channel = supabase
      .channel(`profile:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          if (payload.eventType === 'UPDATE') {
            const {data: newProfile, error} = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (!error && newProfile) {
              setProfile(newProfile as unknown as Profile);
            }
          }
        },
      )
      .subscribe();

    setRealtimeChannel(channel);

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/loginPage');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        return;
      }

      const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data as unknown as Profile);
    }

    fetchProfile();
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    // Update the 'profiles' table in Supabase with the provided updates for the current user
    const {data, error} = await supabase
      .from('profiles') // Specify the 'profiles' table
      .update(updates) // Apply the updates
      .eq('id', user.id) // Filter by the current user's ID
      .select() // Return the updated record
      .single(); // Ensure a single object is returned

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    // Update the local profile state with the new data
    setProfile(data as unknown as Profile);
    // just having data causes errors so i had to cast it to Profile

    // Supabase real-time: This update triggers real-time updates to subscribed clients
    // so down the line all information that is in UserContext will be updated.
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signOut,
    updateProfile,
  };

  // here we print all the stuff that is in the UserContext and basically I am wrapping the session in the context

  // Provide the context value to all child components so the rest of the app
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook to access the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Ensure the hook is used within a UserContextProvider
    throw new Error(
      'useUser must be used within a UserContextProvider basically the app isnt loading user information',
    );
  }
  return context;
}
