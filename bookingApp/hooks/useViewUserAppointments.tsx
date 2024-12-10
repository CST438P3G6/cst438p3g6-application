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
  service_name: string;
  business_name: string;
};

export function useViewUserAppointments(userId: string) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
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
          *,
          service:service_id (
            name,
            business:business_id (
              name
            )
          )
        `,
          )
          .eq('user_id', userId);

      if (error) {
        setError(error.message);
        setAppointments(null);
      } else {
        const transformedData = data.map((appointment: any) => ({
          ...appointment,
          service_name: appointment.service.name,
          business_name: appointment.service.business.name,
        }));
        setAppointments(transformedData as Appointment[]);
      }

      setLoading(false);
    };

    if (userId) {
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
        subscription.unsubscribe();
      }
    };
  }, [userId]);

  return {appointments, loading, error};
}