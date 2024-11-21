import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Modal,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useLocalSearchParams} from 'expo-router';
import {supabase} from '@/utils/supabase';
import {useRouter} from 'expo-router'; 

import {
  Star,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  ChevronLeft, // Add back arrow icon
} from 'lucide-react-native';
import {useCreateAppointment} from '@/hooks/useCreateAppointment';
import {useUser} from '@/context/UserContext';
import Toast from 'react-native-toast-message';

export default function BusinessScreen() {
  const {id} = useLocalSearchParams();
  const router = useRouter(); 
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<{
    type: 'start' | 'end' | null;
  }>({type: null});
  const {createAppointment, loading: creatingAppointment} =
    useCreateAppointment();
  const {user} = useUser();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [businessResponse, servicesResponse] = await Promise.all([
          supabase.from('business').select('*').eq('id', id).single(),
          supabase
            .from('service')
            .select('*')
            .eq('business_id', id)
            .eq('is_active', true),
        ]);

        if (businessResponse.error) throw businessResponse.error;
        if (servicesResponse.error) throw servicesResponse.error;

        setBusiness(businessResponse.data);
        setServices(servicesResponse.data || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const openModal = (service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (showPicker.type === 'start' && selectedDate) {
      setSelectedStartTime(selectedDate);
    } else if (showPicker.type === 'end' && selectedDate) {
      setSelectedEndTime(selectedDate);
    }
    setShowPicker({type: null});
  };

  const showDateTimePicker = (type: 'start' | 'end') => {
    setShowPicker({type});
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedStartTime || !user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select all required fields',
      });
      return;
    }

    const {data, error} = await createAppointment(
      selectedService.id,
      user.id,
      selectedStartTime.toISOString(),
    );

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: error,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Appointment booked successfully!',
      });
      closeModal();
    }
  };

  const availableTimes = [
    '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00'
  ];

  const handleTimeSelection = (time: string) => {
    const date = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0);
    setSelectedStartTime(date);
  };

  const renderServiceItem = ({item}: {item: Service}) => (
    <View style={styles.serviceCard}>
      <Text style={styles.serviceName}>{item.name}</Text>
      {item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}
      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <DollarSign size={16} />
          <Text>${item.cost}</Text>
        </View>
        <View style={styles.detail}>
          <Clock size={16} />
          <Text>{item.time_needed}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => openModal(item)}
        >
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ChevronLeft size={24} color="black" />
      </Pressable>
      {business && (
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{business.name}</Text>
          <Text style={styles.businessDescription}>{business.description}</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Phone size={16} />
              <Text>{business.phone_number}</Text>
            </View>
            <View style={styles.contactRow}>
              <Mail size={16} />
              <Text>{business.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <MapPin size={16} />
              <Text>{business.address}</Text>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesList}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book {selectedService?.name}</Text>
            <TouchableOpacity onPress={() => setShowPicker({type: 'start'})}>
              <Text style={styles.timeSelector}>
                {selectedStartTime
                  ? selectedStartTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                  : 'Select Appointment Time'}
              </Text>
            </TouchableOpacity>
            {showPicker.type === 'start' && (
              <View style={styles.timeSlotList}>
                {availableTimes.map((time) => (
                  <TouchableOpacity key={time} onPress={() => handleTimeSelection(time)}>
                    <Text style={styles.timeSlot}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Button
              title={creatingAppointment ? 'Booking...' : 'Confirm Booking'}
              onPress={handleBooking}
              disabled={creatingAppointment || !selectedStartTime}
            />
            <Button title="Cancel" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessInfo: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  contactInfo: {
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servicesList: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timeSelector: {
    fontSize: 18,
    color: '#4CAF50',
    marginBottom: 16,
  },
  timeSlotList: {
    marginTop: 16,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  timeSlot: {
    fontSize: 18,
    paddingVertical: 8,
    color: '#4CAF50',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
