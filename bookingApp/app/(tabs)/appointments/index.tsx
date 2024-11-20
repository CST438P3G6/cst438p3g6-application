import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {useViewUserAppointments} from '@/hooks/useViewUserAppointments';
import {useCancelAppointment} from '@/hooks/useCancelAppointment';
import {useUser} from '@/context/UserContext';

export default function AppointmentsList() {
  const {user, loading: userLoading, error: userError} = useUser();
  const userId = user?.id;

  const {appointments, loading, error} = useViewUserAppointments(userId);
  const {cancelAppointment} = useCancelAppointment();

  if (userLoading || loading) return <Text>Loading...</Text>;
  if (userError) return <Text>Error: {userError}</Text>;
  if (error) return <Text>Error: {error}</Text>;

  const renderItem = ({item}) => (
    <View>
      <Text>Service ID: {item.service_id}</Text>
      <Text>Start Time: {item.start_time}</Text>
      <Text>End Time: {item.end_time}</Text>
      <Text>Status: {item.status}</Text>
      <TouchableOpacity onPress={() => cancelAppointment(item.id)}>
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Text>Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
