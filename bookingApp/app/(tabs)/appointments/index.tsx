// this is all just dummy stuff so i can make sure the routing works.
import {View, Text, FlatList, Pressable, StyleSheet} from 'react-native';
import {Link} from 'expo-router';

const dummyAppointments = [
  {id: '1', title: 'Dental Check-up', date: '2024-03-20', time: '10:00 AM'},
  {id: '2', title: 'Eye Exam', date: '2024-03-22', time: '2:30 PM'},
  {id: '3', title: 'Physical Therapy', date: '2024-03-25', time: '11:15 AM'},
];

export default function AppointmentsList() {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <Link href={`/appointment/${item.id}` as const} asChild>
            <Pressable style={styles.appointmentCard}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>
                {item.date} at {item.time}
              </Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  appointmentCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
