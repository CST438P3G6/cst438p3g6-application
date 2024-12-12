import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useState} from 'react';
import {useViewUserAppointments} from '@/hooks/useViewUserAppointments';
import {useCancelAppointment} from '@/hooks/useCancelAppointment';
import {useUser} from '@/context/UserContext';
import {Calendar, Clock, X, AlertCircle} from 'lucide-react-native';
import {format} from 'date-fns';

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  service_id: number;
  service_name: string;
  business_name: string;
  cost: number;
}

export default function AppointmentsPage() {
  const [showInactive, setShowInactive] = useState(false);
  const {profile} = useUser();
  const {appointments, loading, error} = useViewUserAppointments(
      profile?.id || '',
  );

  const {cancelAppointment, loading: cancelLoading} = useCancelAppointment();

  const filteredAppointments = appointments
      ? appointments.filter((appointment) =>
          showInactive
              ? appointment.status === 'cancelled' ||
              appointment.status === 'completed'
              : appointment.status !== 'cancelled' &&
              appointment.status !== 'completed',
      )
      : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#059669';
      case 'pending':
        return '#D97706';
      case 'cancelled':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const renderAppointmentItem = ({item}: {item: Appointment}) => {
    return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.serviceInfo}>
              <View>
                <Text style={styles.businessTitle}>{item.business_name}</Text>
                <Text style={styles.serviceTitle}>{item.service_name}</Text>
              </View>
              <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(item.status)},
                  ]}
              >
                <Text style={styles.statusText}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.timeRow}>
              <View style={styles.timeInfo}>
                <Calendar size={16} color="#4b5563" />
                <Text style={styles.timeText}>
                  {format(new Date(item.start_time), 'MMM dd, yyyy')}
                </Text>
              </View>
              <Text style={styles.costText}>${item.cost}</Text>
            </View>
            <View style={styles.timeRow}>
              <View style={styles.timeInfo}>
                <Clock size={16} color="#4b5563" />
                <Text style={styles.timeText}>
                  {format(new Date(item.start_time), 'h:mm a')} -{' '}
                  {format(new Date(item.end_time), 'h:mm a')}
                </Text>
              </View>
            </View>
          </View>

          {item.status !== 'completed' && item.status !== 'cancelled' && (
              <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelAppointment(item.id)}
                  disabled={cancelLoading}
              >
                <X size={16} color="#fff" />
                <Text style={styles.cancelButtonText}>
                  {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
                </Text>
              </TouchableOpacity>
          )}
        </View>
    );
  };

  if (loading) {
    return (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.centerContainer}>
          <AlertCircle size={24} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <TouchableOpacity
            style={[styles.toggleButton, showInactive && styles.toggleButtonActive]}
            onPress={() => setShowInactive(!showInactive)}
        >
          <Text
              style={[
                styles.toggleButtonText,
                showInactive && styles.toggleButtonTextActive,
              ]}
          >
            {showInactive ? 'Show Active' : 'Show Inactive'}
          </Text>
        </TouchableOpacity>

        <FlatList
            style={styles.list}
            data={filteredAppointments || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAppointmentItem}
            ListEmptyComponent={() => (
                <Text style={styles.emptyText}>
                  {showInactive
                      ? 'No inactive appointments'
                      : 'No active appointments'}
                </Text>
            )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7FF', // Updated background color
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F7FF', // Same as container background
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
    backgroundColor: '#ffffff',
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
  businessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8,
    color: '#4b5563',
    fontSize: 14,
  },
  costText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ef4444', // Red cancel button
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
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
  },
  toggleButton: {
    backgroundColor: '#f3f4f6', // Light gray background
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#dc2626', // Red active state
  },
  toggleButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
});
