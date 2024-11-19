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
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);
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
    if (!user) throw new Error('No authenticated user');

    try {
      const {data, error} = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update profile');

      setProfile(data as Profile);
    } catch (err) {
      console.error('Profile update failed:', err);
      throw err;
    }
  };

  useEffect(() => {
    const refreshSession = async () => {
      const {
        data: {session},
        error,
      } = await supabase.auth.refreshSession();
      if (error) {
        await signOut();
      }
    };

    // Refresh session every 30 minutes
    const interval = setInterval(refreshSession, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    signIn,
    signOut,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function isValidProfile(data: any): data is Profile {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.email === 'string'
    // Add other field validations
  );
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
