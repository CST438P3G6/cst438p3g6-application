import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {useViewBusinessAppointments} from '@/hooks/useViewBusinessAppointments';
import {supabase} from '@/utils/supabase';
import Toast from 'react-native-toast-message';

export default function AppointmentView() {
  const {id} = useLocalSearchParams();
  const {appointments, loading, error} = useViewBusinessAppointments(
    id as string,
  );
  const [localAppointments, setLocalAppointments] = useState(appointments);

  useEffect(() => {
    const sortedAppointments = [...appointments].sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
    );
    setLocalAppointments(sortedAppointments);
  }, [appointments]);

  const updateStatus = async (appointmentId: number, status: string) => {
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
      // Update local state
      setLocalAppointments(
        (prev) =>
          prev?.map((apt) =>
            apt.id === appointmentId ? {...apt, status} : apt,
          ) || [],
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        data={localAppointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.dateText}>
                {new Date(item.start_time).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.timeContainer}>
              <Text>
                Start: {new Date(item.start_time).toLocaleTimeString()}
              </Text>
              <Text>End: {new Date(item.end_time).toLocaleTimeString()}</Text>
            </View>

            <View style={styles.appointmentDetails}>
              <Text>
                Name:{' '}
                {item.user
                  ? `${item.user.first_name} ${item.user.last_name}`
                  : 'Unknown name'}
              </Text>
              <Text>Email: {item.user ? item.user.email : 'Unknown email'}</Text>
                <Text>
                    Phone: {item.user ? item.user.phone_number : 'Unknown phone'}
                </Text>
              <Text>
                Service: {item.service ? item.service.name : 'Unknown Service'}
              </Text>
                <Text>
                    Cost: {item.cost ? `$${item.cost}` : 'Unknown cost'}
                </Text>
            </View>

            <View style={styles.statusContainer}>
              {['pending', 'confirmed', 'completed', 'cancelled'].map(
                (status) => (
                  <TouchableOpacity
                    key={`${item.id}-${status}`}
                    style={[
                      styles.statusButton,
                      item.status === status && styles.activeStatusButton,
                    ]}
                    onPress={async () => {
                      await updateStatus(item.id, status);
                      setLocalAppointments((prevAppointments) =>
                        prevAppointments.map((appt) =>
                          appt.id === item.id ? {...appt, status} : appt,
                        ),
                      );
                    }}
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
                ),
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  appointmentCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appointmentId: {
    fontWeight: 'bold',
  },
  dateText: {
    color: '#666',
  },
  timeContainer: {
    marginBottom: 12,
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  activeStatusButton: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    color: '#374151',
    fontSize: 14,
  },
  activeStatusText: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});
