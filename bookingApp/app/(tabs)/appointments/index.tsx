import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useViewUserAppointments } from '@/hooks/useViewUserAppointments';
import { useCancelAppointment } from '@/hooks/useCancelAppointment';
import { useUser } from '@/context/UserContext';
import { Calendar, Clock, X } from 'lucide-react-native';

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
}

export default function AppointmentsPage() {
  const { profile } = useUser();
  const { appointments, loading, error } = useViewUserAppointments(profile?.id || '');
  const { cancelAppointment, loading: cancelLoading, error: cancelError } = useCancelAppointment();

  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments || []);

  useEffect(() => {
    
    setFilteredAppointments(appointments || []);
  }, [appointments]);

  const handleCancel = async (appointmentId: number) => {
    try {
      await cancelAppointment(appointmentId);
      

      setFilteredAppointments(prevAppointments =>
        prevAppointments.filter(appointment => appointment.id !== appointmentId)
      );
    } catch (err) {
      console.error('Error canceling appointment:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAppointments || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderItem(item, handleCancel, cancelLoading)}
        ListEmptyComponent={() => <Text>No appointments found</Text>}
      />
      {cancelError && (
        <Text style={styles.errorText}>
          {cancelError}
        </Text>
      )}
      {cancelLoading && (
        <Text style={styles.loadingText}>Canceling appointment...</Text>
      )}
    </View>
  );
}

const renderItem = (
  item: Appointment,
  handleCancel: (appointmentId: number) => void,
  cancelLoading: boolean
) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{item.service_id}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === 'confirmed' ? '#22c55e' : '#f59e0b',
            },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>

    <View style={styles.cardContent}>
      <View style={styles.timeRow}>
        <Clock size={16} color="#6b7280" />
        <Text style={styles.timeText}>Start: {item.start_time}</Text>
      </View>
      <View style={styles.timeRow}>
        <Calendar size={16} color="#6b7280" />
        <Text style={styles.timeText}>End: {item.end_time}</Text>
      </View>
      <Text>Status: {item.status}</Text>
    </View>

    <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => handleCancel(item.id)} 
      disabled={cancelLoading} 
    >
      <X size={16} color="#fff" />
      <Text style={styles.cancelButtonText}>
        {cancelLoading ? 'Canceling...' : 'Cancel Appointment'}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    marginLeft: 8,
    color: '#4b5563',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 8,
    color: '#ef4444',
  },
});
