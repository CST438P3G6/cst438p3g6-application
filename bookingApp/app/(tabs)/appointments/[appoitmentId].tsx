import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';

const dummyAppointments = {
  '1': {
    id: '1',
    title: 'Dental Check-up',
    date: '2024-03-20',
    time: '10:00 AM',
    doctor: 'Dr. Smith',
    location: 'Dental Clinic',
  },
  '2': {
    id: '2',
    title: 'Eye Exam',
    date: '2024-03-22',
    time: '2:30 PM',
    doctor: 'Dr. Johnson',
    location: 'Vision Care Center',
  },
  '3': {
    id: '3',
    title: 'Physical Therapy',
    date: '2024-03-25',
    time: '11:15 AM',
    doctor: 'Dr. Brown',
    location: 'PT Center',
  },
};

export default function AppointmentDetails() {
  const {appointmentId} = useLocalSearchParams();
  const router = useRouter();
  const appointment =
    dummyAppointments[appointmentId as keyof typeof dummyAppointments];

  const handleCancel = () => {
    alert('Appointment cancelled');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{appointment.title}</Text>
      <Text style={styles.detail}>Date: {appointment.date}</Text>
      <Text style={styles.detail}>Time: {appointment.time}</Text>
      <Text style={styles.detail}>Doctor: {appointment.doctor}</Text>
      <Text style={styles.detail}>Location: {appointment.location}</Text>

      <Pressable style={styles.button} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancel Appointment</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
