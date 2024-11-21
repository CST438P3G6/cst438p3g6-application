import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {supabase} from '@/utils/supabase';
import Toast from 'react-native-toast-message';
import {useLocalSearchParams} from 'expo-router';
import {useViewBusinessAppointments} from '@/hooks/useViewBusinessAppointments';

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  cost: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  service_id: number;
  service: {
    business_id: string;
  };
}

export default function AppointmentView() {
  const {serviceId} = useLocalSearchParams();
  const [businessId, setBusinessId] = useState<string | null>(null);

  // Fetch business ID for the service
  useEffect(() => {
    const getBusinessId = async () => {
      const {data, error} = await supabase
        .from('service')
        .select('business_id')
        .eq('id', serviceId)
        .single();

      if (data) {
        setBusinessId(data.business_id);
      }
    };

    getBusinessId();
  }, [serviceId]);

  // Use the hook to fetch appointments
  const {appointments, loading, error} = useViewBusinessAppointments(
    businessId || '',
  );

  // Real-time updates
  useEffect(() => {
    if (!businessId) return;

    const subscription = supabase
      .channel('appointment_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointment',
          filter: `service.business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAppointments((prev) => [payload.new as Appointment, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAppointments((prev) =>
              prev.map((item) =>
                item.id === (payload.new as Appointment).id
                  ? (payload.new as Appointment)
                  : item,
              ),
            );
          } else if (payload.eventType === 'DELETE') {
            setAppointments((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [businessId]);

  const updateStatus = async (
    appointmentId: number,
    status: Appointment['status'],
  ) => {
    const {error} = await supabase
      .from('appointment')
      .update({status})
      .eq('id', appointmentId);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Status updated successfully',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={appointments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (
        <View style={styles.appointmentCard}>
          <Text>Appointment #{item.id}</Text>
          <Text>Start: {new Date(item.start_time).toLocaleString()}</Text>
          <Text>End: {new Date(item.end_time).toLocaleString()}</Text>
          <Text>Status: {item.status}</Text>
          <View style={styles.buttonsContainer}>
            {[
              'pending',
              'confirmed',
              'completed',
              'cancelled',
              'rescheduled',
            ].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  item.status === status && styles.activeStatusButton,
                ]}
                onPress={() =>
                  updateStatus(item.id, status as Appointment['status'])
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === status && styles.activeStatusText,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  activeStatusButton: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    color: '#374151',
  },
  activeStatusText: {
    color: 'white',
  },
});
