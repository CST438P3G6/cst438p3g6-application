// hooks/useViewBusinessAppointments.tsx

import {useState, useEffect} from 'react';
import {supabase} from '@/utils/supabase';

type Appointment = {
  id: number;
  service_id: number;
  start_time: string;
  end_time: string;
  status: string;
  user_id: string | null;
  cost: number | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone_number: string;
  } | null;
  service: {
    id: number;
    name: string;
    business_id: number;
    cost: number;
  } | null;
};

export function useViewBusinessAppointments(businessId: number) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any;

    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      const {data, error} = await supabase
        .from('appointment')
        .select(
          `
          id,
          service_id,
          start_time,
          end_time,
          status,
          user_id,
          cost,
          user:profiles!appointment_profile_id_fkey (
            id,
            first_name,
            last_name,
            email,
            phone_number
          ),
          service:service_id (
            id,
            name,
            business_id,
            cost
          )
        `,
        )
        .in(
          'service_id',
          await (async () => {
            const {data} = await supabase
              .from('service')
              .select('id')
              .eq('business_id', businessId);
            return data?.map((row) => row.id) || [];
          })(),
        );

      if (error) {
        setError(error.message);
        setAppointments([]);
      } else {
        setAppointments(data as Appointment[]);
      }

      setLoading(false);
    };

    if (businessId) {
      fetchAppointments();
      subscription = supabase
        .channel('public:appointment')
        .on(
          'postgres_changes',
          {event: '*', schema: 'public', table: 'appointment'},
          () => {
            fetchAppointments();
          },
        )
        .subscribe();
    }
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [businessId]);

  return {appointments, loading, error};
}
