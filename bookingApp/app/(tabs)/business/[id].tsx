import React, { useState, useEffect } from 'react';
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
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';

import {
  DollarSign,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
} from 'lucide-react-native';
import { useViewBusinessAppointments } from '@/hooks/useViewBusinessAppointments';
import { useUser } from '@/context/UserContext';
import Toast from 'react-native-toast-message';

export default function BusinessScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<{
    type: 'start' | 'end' | null;
  }>({ type: null });
  const { user } = useUser();
  const { appointments } = useViewBusinessAppointments(id);
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
    setShowPicker({ type: null });
  };

  const showDateTimePicker = (type: 'start' | 'end') => {
    setShowPicker({ type });
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

    // Your logic for creating the appointment
    // Assuming createAppointment logic is implemented somewhere
    // const { data, error } = await createAppointment(
    //   selectedService.id,
    //   user.id,
    //   selectedStartTime.toISOString(),
    // );

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Appointment booked successfully!',
    });
    closeModal();
  };

  const availableTimes = [
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
  ];

  const isTimeAvailable = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const selectedStartTime = new Date();
    selectedStartTime.setHours(hours, minutes, 0);

    // Check if the selected start time overlaps with any existing appointments
    const isAvailable = !appointments?.some((appointment) => {
      const appointmentStart = new Date(appointment.start_time);
      const appointmentEnd = new Date(appointment.end_time);

      return (
        selectedStartTime >= appointmentStart && selectedStartTime < appointmentEnd
      );
    });

    return isAvailable;
  };

  const filteredAvailableTimes = availableTimes.filter(isTimeAvailable);

  const handleTimeSelection = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes, 0);

    setSelectedStartTime(selectedTime);
    setShowPicker({ type: 'end' }); // Automatically show the end time picker
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
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
            <TouchableOpacity onPress={() => setShowPicker({ type: 'start' })}>
              <Text style={styles.timeSelector}>
                {selectedStartTime
                  ? selectedStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Select Appointment Time'}
              </Text>
            </TouchableOpacity>
            {showPicker.type === 'start' && (
              <View style={styles.timeSlotList}>
                {filteredAvailableTimes.map((time) => (
                  <TouchableOpacity key={time} onPress={() => handleTimeSelection(time)}>
                    <Text style={styles.timeSlot}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Button
              title={'Confirm Booking'}
              onPress={handleBooking}
              disabled={!selectedStartTime}
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
    marginBottom: 16,
  },
  contactInfo: {
    marginTop: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  servicesList: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookButton: {
    backgroundColor: '#34D399',
    padding: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    marginLeft: 16,
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeSlotList: {
    marginBottom: 16,
  },
  timeSlot: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
    borderRadius: 4,
  },
  timeSelector: {
    fontSize: 16,
    marginBottom: 16,
  },
});
