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
  Alert,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker'; // Web-specific date picker
import 'react-datepicker/dist/react-datepicker.css'; // Web-specific styles
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import { useUser } from '@/context/UserContext';
import Toast from 'react-native-toast-message';
import { useViewBusinessHours } from '@/hooks/useViewBusinessHours';
import { useViewBusinessImages } from '@/hooks/useViewBusinessImages';
import { useAvailableTimeSlots } from '@/hooks/useAvailableTimeSlots';

type Business = {
  id: number;
  name: string;
  description: string;
  phone_number: string;
  address: string;
  email: string;
};

type Service = {
  id: number;
  name: string;
  description: string;
  cost: number;
  time_needed: string;
};

export default function BusinessScreen() {
  const { id } = useLocalSearchParams();
  const businessId = Array.isArray(id) ? id[0] : id; // Ensure id is a string or number
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { createAppointment, loading: creatingAppointment } = useCreateAppointment();
  const { user } = useUser();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { businessHours, loading: hoursLoading, error: hoursError } = useViewBusinessHours(businessId as string);
  const { images, loading: imagesLoading, error: imagesError } = useViewBusinessImages(businessId as string);

  const { availableTimeSlots, loading: slotsLoading, error: slotsError } = useAvailableTimeSlots(
      businessId as number,
      selectedDate?.toISOString() || '',
      selectedDate?.toISOString() || '',
      selectedService ? parseInt(selectedService.time_needed.split(':')[1], 10) : 0,
      15
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [businessResponse, servicesResponse] = await Promise.all([
          supabase.from('business').select('*').eq('id', businessId).single(),
          supabase.from('service').select('*').eq('business_id', businessId).eq('is_active', true),
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
  }, [businessId]);

  const openModal = (service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const renderDateSelector = () => {
    if (Platform.OS === 'web') {
      return (
          <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date as Date)}
              inline
          />
      );
    }

    return (
        <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => date && setSelectedDate(date)}
        />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(date);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  };

  const handleBookAppointment = async (slotStart: string, slotEnd: string) => {
    if (!selectedService || !user) return;

    try {
      await createAppointment(
          selectedService.id,
          user.id,
          slotStart
      );
      Toast.show({
        type: 'success',
        text1: 'Appointment booked successfully!',
      });
      closeModal();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to book appointment',
      });
      console.error(error);
    }
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
      <View style={styles.serviceCard}>
        <Text style={styles.serviceName}>{item.name}</Text>
        {item.description && <Text style={styles.description}>{item.description}</Text>}
        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Text>${item.cost}</Text>
          </View>
          <View style={styles.detail}>
            <Text>{item.time_needed}</Text>
          </View>
        </View>
        <Button title="Book" onPress={() => openModal(item)} />
      </View>
  );

  if (loading || hoursLoading || imagesLoading) {
    return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        {business && (
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{business.name}</Text>
              <Text style={styles.businessDescription}>{business.description}</Text>
              <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                  <Text>{business.phone_number}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Text>{business.email}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Text>{business.address}</Text>
                </View>
              </View>
              <View style={styles.businessHours}>
                <Text style={styles.hoursTitle}>Business Hours</Text>
                {businessHours.map((hour, index) => (
                    <View key={index} style={styles.hourRow}>
                      <Text style={styles.day}>{hour.day}</Text>
                      <Text style={styles.time}>{hour.open_time} - {hour.close_time}</Text>
                    </View>
                ))}
              </View>
              <View style={styles.businessImages}>
                <Text style={styles.imagesTitle}>Business Images</Text>
                <FlatList
                    data={images}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                          <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="contain" />
                        </View>
                    )}
                    horizontal
                />
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
              <Text style={styles.modalTitle}>Select a Date</Text>
              {renderDateSelector()}
              <Button title="View Available Appointments" onPress={() => {}} disabled={slotsLoading} />
              <Button title="Cancel" onPress={closeModal} />
              {slotsLoading && <ActivityIndicator size="large" color="#0000ff" />}
              {slotsError && <Text style={styles.errorText}>{slotsError}</Text>}
              <FlatList
                  data={availableTimeSlots}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                      <View style={styles.slotContainer}>
                        <View style={styles.slotTextContainer}>
                          <Text>{formatDate(item.slot_start)}</Text>
                          <Text>{`${formatTime(item.slot_start)} - ${formatTime(item.slot_end)}`}</Text>
                        </View>
                        <Button
                            title="Book"
                            onPress={() => handleBookAppointment(item.slot_start, item.slot_end)}
                            disabled={creatingAppointment}
                        />
                      </View>
                  )}
                  contentContainerStyle={styles.scrollView} // Use this to apply additional styles
                  style={{ maxHeight: 300 }} // Limit FlatList height if needed
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  businessHours: {
    marginTop: 16,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  day: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    color: '#666',
  },
  businessImages: {
    marginTop: 16,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageContainer: {
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
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
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 12,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 300,
  },
  slotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  slotTextContainer: {
    flex: 1,
    marginRight: 10,
  },
});