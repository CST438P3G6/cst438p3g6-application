import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useViewUserAppointments} from '@/hooks/useViewUserAppointments';
import {useUser} from '@/context/UserContext';
import {Calendar, Clock, X, AlertCircle, Loader} from 'lucide-react-native';
import {useState, useEffect} from 'react';
import {supabase} from '@/utils/supabase';
import {useCancelAppointment} from '@/hooks/useCancelAppointment'; // Import the hook

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  // Add other fields as needed
}

const AppointmentsScreen = () => {
  const {cancelAppointment, loading, error} = useCancelAppointment();
  const {user} = useUser();
  const {appointments} = useViewUserAppointments(user.id); // Assuming this hook fetches appointments

  const handleCancel = (appointmentId: number) => {
    cancelAppointment(appointmentId);
  };

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.appointment}>
            <Text>
              {item.start_time} - {item.end_time}
            </Text>
            <TouchableOpacity
              onPress={() => handleCancel(item.id)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  appointment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default AppointmentsScreen;
