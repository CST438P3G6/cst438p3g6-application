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
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import { useUser } from '@/context/UserContext';
import Toast from 'react-native-toast-message';
import { useViewBusinessHours } from '@/hooks/useViewBusinessHours';
import { useViewBusinessImages } from '@/hooks/useViewBusinessImages';

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
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<{ type: 'start' | 'end' | null }>({ type: null });
  const { createAppointment, loading: creatingAppointment } = useCreateAppointment();
  const { user } = useUser();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { businessHours, loading: hoursLoading, error: hoursError } = useViewBusinessHours(id as string);
  const { images, loading: imagesLoading, error: imagesError } = useViewBusinessImages(id as string);

  useEffect(() => {
    async function fetchData() {
      try {
        const [businessResponse, servicesResponse] = await Promise.all([
          supabase.from('business').select('*').eq('id', id).single(),
          supabase.from('service').select('*').eq('business_id', id).eq('is_active', true),
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

    const { data, error } = await createAppointment(
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
              <Text style={styles.modalTitle}>Book {selectedService?.name}</Text>
              <TouchableOpacity onPress={() => showDateTimePicker('start')}>
                <Text style={styles.timeSelector}>
                  {selectedStartTime ? selectedStartTime.toLocaleTimeString() : 'Select Start Time'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showDateTimePicker('end')}>
                <Text style={styles.timeSelector}>
                  {selectedEndTime ? selectedEndTime.toLocaleTimeString() : 'Select End Time'}
                </Text>
              </TouchableOpacity>
              <Button
                  title="Book Appointment"
                  onPress={handleBooking}
                  disabled={creatingAppointment}
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
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
  timeSelector: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
    textAlign: 'center',
  },
});