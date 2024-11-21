import {useState, useEffect} from 'react';
import {supabase} from '@/utils/supabase';

type Appointment = {
  id: number;
  service_id: number;
  start_time: string;
  end_time: string;
  status: string;
  user_id: string;
  cost: number;
};

export function useViewUserAppointments(userId: string) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      const {data, error} = await supabase
        .from('appointment')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        setError(error.message);
        setAppointments(null);
      } else {
        setAppointments(data as Appointment[]);
      }

      setLoading(false);
    };

    if (userId) {
      fetchAppointments();

      const subscription = supabase
        .channel('appointments_channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'appointment',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setAppointments((prev) =>
                prev
                  ? [...prev, payload.new as Appointment]
                  : [payload.new as Appointment],
              );
            } else if (payload.eventType === 'UPDATE') {
              setAppointments((prev) =>
                prev
                  ? prev.map((app) =>
                      app.id === payload.new.id
                        ? (payload.new as Appointment)
                        : app,
                    )
                  : null,
              );
            } else if (payload.eventType === 'DELETE') {
              setAppointments((prev) =>
                prev ? prev.filter((app) => app.id !== payload.old.id) : null,
              );
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [userId]);

  return {appointments, loading, error};
}
