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
  Dimensions,
  TouchableOpacity,
  Linking
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import { useUser } from '@/context/UserContext';
import Toast from 'react-native-toast-message';
import { useViewBusinessHours } from '@/hooks/useViewBusinessHours';
import { useViewBusinessImages } from '@/hooks/useViewBusinessImages';
import { useAvailableTimeSlots } from '@/hooks/useAvailableTimeSlots';
import { Phone, Mail, MapPin } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

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

type AvailableTimeSlot = {
  slot_start: string;
  slot_end: string;
};

export default function BusinessScreen() {
  const { id } = useLocalSearchParams();
  const businessId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { createAppointment, loading: creatingAppointment } = useCreateAppointment();
  const { user } = useUser();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { businessHours, loading: hoursLoading, error: hoursError } = useViewBusinessHours(businessId.toString());
  const { images, loading: imagesLoading, error: imagesError } = useViewBusinessImages(businessId.toString());

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { availableTimeSlots, loading: slotsLoading, error: slotsError } = useAvailableTimeSlots(
      businessId,
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

        setBusiness(businessResponse.data as Business);
        setServices(servicesResponse.data as Service[] || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [businessId]);

  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);

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

  const formatBusinessHours = (timeString: string) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  };

  const handleBookAppointment = async (slotStart: string, slotEnd: string) => {
    if (!selectedService || !user) return;

    try {
      await createAppointment(selectedService.id, user.id, slotStart);
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

  const handleOpenEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleOpenPhone = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleOpenMaps = (address: string) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
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

  const currentImage = images && images.length > 0 ? images[currentImageIndex] : null;

  return (
      <SafeAreaView style={styles.container}>
        <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
            ListHeaderComponent={
              <>
                <View style={styles.businessImages}>
                  {currentImage && (
                      <TouchableOpacity onPress={() => handleImageClick(currentImage.image_url)}>
                        <View style={styles.imageContainer}>
                          <Image source={{ uri: currentImage.image_url }} style={styles.slideshowImage} />
                        </View>
                      </TouchableOpacity>
                  )}
                </View>
                {business && (
                    <View style={styles.businessInfo}>
                      <Text style={styles.businessName}>{business.name}</Text>
                      <Text style={styles.businessDescription}>{business.description}</Text>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactTitle}>Contact Information</Text>
                        <View style={styles.contactRow}>
                          <Phone size={20} color="#000" />
                          <TouchableOpacity onPress={() => handleOpenPhone(business.phone_number)}>
                            <Text style={styles.normalText}>{business.phone_number}</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.contactRow}>
                          <Mail size={20} color="#000" />
                          <TouchableOpacity onPress={() => handleOpenEmail(business.email)}>
                            <Text style={styles.normalText}>{business.email}</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.contactRow}>
                          <MapPin size={20} color="#000" />
                          <TouchableOpacity onPress={() => handleOpenMaps(business.address)}>
                            <Text style={styles.normalText}>{business.address}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.businessHours}>
                        <Text style={styles.hoursTitle}>Business Hours</Text>
                        {businessHours.map((hour, index) => (
                            <View key={index} style={styles.hourRow}>
                              <Text style={styles.day}>{hour.day}</Text>
                              {hour.open_time === '00:00:00' && hour.close_time === '00:00:00' ? (
                                  <Text style={styles.time}>CLOSED</Text>
                              ) : (
                                  <Text style={styles.time}>{formatBusinessHours(hour.open_time)} - {formatBusinessHours(hour.close_time)}</Text>
                              )}
                            </View>
                        ))}
                      </View>
                    </View>
                )}
              </>
            }
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
              <Button title="Cancel" onPress={closeModal} />
              {slotsLoading && <ActivityIndicator size="large" color="#0000ff" />}
              <FlatList
                  data={availableTimeSlots}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                      <View style={styles.slotContainer}>
                        <View style={styles.slotTextContainer}>
                          <Text>{formatTime(item.slot_start)} - {formatTime(item.slot_end)}</Text>
                        </View>
                        <Button title="Book" onPress={() => handleBookAppointment(item.slot_start, item.slot_end)} />
                      </View>
                  )}
                  style={{ maxHeight: 300 }}
              />
            </View>
          </View>
        </Modal>
        <Modal
            visible={imageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeImageModal}
        >
          <View style={styles.imageModalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
            )}
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
  scrollViewContent: {
    paddingBottom: 16,
  },
  businessInfo: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 16,
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
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  normalText: {
    color: '#000',
    textDecorationLine: 'none',
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
    alignItems: 'center',
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  imageContainer: {
    width: screenWidth * 0.9,
    height: (screenWidth * 0.9) * (9 / 16),
    overflow: 'hidden',
    borderRadius: 8,
  },
  slideshowImage: {
    width: '100%',
    height: '100%',
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
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});