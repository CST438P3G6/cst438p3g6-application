// useUserBusiness.tsx
import {useState, useEffect} from 'react';
import {supabase} from '@/utils/supabase';
import {RealtimeChannel} from '@supabase/supabase-js';

export const useUserBusinesses = (userId: string | null) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    if (!userId) return;
    console.log('Fetching businesses for user:', userId); // Debug log

    try {
      setLoading(true);
      const {data, error: fetchError} = await supabase
        .from('business')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;
      console.log('Fetched businesses:', data); // Debug log
      setBusinesses(data || []);
    } catch (err: any) {
      console.error('Fetch error:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setupSubscription = async () => {
      if (!userId) return;

      // Initial fetch
      await fetchBusinesses();

      // Setup realtime subscription
      channel = supabase.channel(`business_changes_${userId}`).on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Received realtime payload:', payload); // Debug log

          switch (payload.eventType) {
            case 'DELETE':
              console.log('Handling DELETE');
              setBusinesses((prev) =>
                prev.filter((business) => business.id !== payload.old.id),
              );
              break;
            case 'INSERT':
              console.log('Handling INSERT');
              setBusinesses((prev) => [...prev, payload.new as Business]);
              break;
            case 'UPDATE':
              console.log('Handling UPDATE');
              setBusinesses((prev) =>
                prev.map((business) =>
                  business.id === payload.new.id
                    ? (payload.new as Business)
                    : business,
                ),
              );
              break;
          }
        },
      );

      channel.subscribe((status) => {
        console.log('Subscription status:', status); // Debug log
      });
    };

    setupSubscription();

    // Cleanup
    return () => {
      if (channel) {
        console.log('Cleaning up subscription'); // Debug log
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  return {businesses, loading, error, refetch: fetchBusinesses};
};
