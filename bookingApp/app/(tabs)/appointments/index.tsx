import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useViewUserAppointments} from '@/hooks/useViewUserAppointments';
import {useCancelAppointment} from '@/hooks/useCancelAppointment';
import {useUser} from '@/context/UserContext';
import {Calendar, Clock, X, AlertCircle, Loader} from 'lucide-react-native';
import {useState, useEffect} from 'react';
import {supabase} from '@/utils/supabase';

// Add this interface
interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  // Add other fields as needed
}

export default function AppointmentsPage() {
  const {profile} = useUser();
  const {appointments, loading, error} = useViewUserAppointments(
    profile?.id || '',
  );

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
        data={appointments || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text>No appointments found</Text>}
      />
    </View>
  );
}

const renderItem = ({item}: {item: Appointment}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{item.service_id}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'confirmed' ? '#22c55e' : '#f59e0b',
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
      onPress={() => cancelAppointment(item.id)}
    >
      <X size={16} color="#fff" />
      <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    padding: 16,
    color: '#111827',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
