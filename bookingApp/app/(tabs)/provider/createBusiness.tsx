import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCreateBusiness } from '@/hooks/useCreateBusiness';
import { useUpsertBusinessHours } from '@/hooks/useUpsertBusinessHours';
import { useAddBusinessImages } from '@/hooks/useAddBusinessImages';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type BusinessHour = {
  business_id: string;
  day: string;
  open_time: string;
  close_time: string;
};

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function CreateBusiness() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const { createBusiness, loading, error } = useCreateBusiness();
  const { upsertBusinessHours, loading: upsertLoading, error: upsertError } = useUpsertBusinessHours();
  const { uploadImages, loading: uploadLoading, error: uploadError } = useAddBusinessImages();
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(
      daysOfWeek.map((day) => ({
        business_id: '',
        day,
        open_time: '09:00',
        close_time: '17:00',
      }))
  );

  const handleTimeChange = (index: number, field: 'open_time' | 'close_time', date: Date) => {
    const updatedHours = [...businessHours];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    updatedHours[index][field] = `${hours}:${minutes}`;
    setBusinessHours(updatedHours);
  };

  const handleCloseDay = (index: number) => {
    const updatedHours = [...businessHours];
    updatedHours[index].open_time = '00:00';
    updatedHours[index].close_time = '00:00';
    setBusinessHours(updatedHours);
  };

  const handleSaveBusinessHours = async (businessId: string) => {
    for (const hour of businessHours) {
      const [openHour, openMinute] = hour.open_time.split(':').map(Number);
      const [closeHour, closeMinute] = hour.close_time.split(':').map(Number);

      if (!(openHour === 0 && openMinute === 0 && closeHour === 0 && closeMinute === 0)) {
        if (openHour > closeHour || (openHour === closeHour && openMinute >= closeMinute)) {
          Toast.show({
            type: 'error',
            text1: 'Invalid Time',
            text2: `Open time must be before close time for ${hour.day}.`,
            position: 'bottom',
            visibilityTime: 1000,
          });
          return;
        }
      }
    }

    const updatedHours = businessHours.map((hour) => ({
      ...hour,
      business_id: businessId,
    }));

    const result = await upsertBusinessHours(updatedHours);

    if (result.error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating business hours',
        text2: result.error,
        position: 'bottom',
        visibilityTime: 1000,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Business hours updated successfully',
        position: 'bottom',
        visibilityTime: 1000,
      });
    }
  };

  const handleCreateBusiness = async () => {
    for (const hour of businessHours) {
      const [openHour, openMinute] = hour.open_time.split(':').map(Number);
      const [closeHour, closeMinute] = hour.close_time.split(':').map(Number);

      if (!(openHour === 0 && openMinute === 0 && closeHour === 0 && closeMinute === 0)) {
        if (openHour > closeHour || (openHour === closeHour && openMinute >= closeMinute)) {
          Toast.show({
            type: 'error',
            text1: 'Invalid Time',
            text2: `Open time must be before close time for ${hour.day}.`,
            position: 'bottom',
            visibilityTime: 1000,
          });
          return;
        }
      }
    }

    const business = {
      name,
      description,
      phone_number: phoneNumber,
      address,
      email,
      is_active: true,
    };
    const { data, error } = await createBusiness(business);
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
        position: 'bottom',
        visibilityTime: 1000,
      });
    } else if (data && data.id) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Business created successfully',
        position: 'bottom',
        visibilityTime: 1000,
      });
      await handleSaveBusinessHours(data.id);
      await handleUploadImages(data.id);
      router.push('/provider');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create business',
        position: 'bottom',
        visibilityTime: 1000,
      });
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets.map(asset => asset.uri));
    }
  };

  const handleUploadImages = async (businessId: string) => {
    if (images.length === 0) {
      return;
    }

    try {
      let files;
      if (Platform.OS === 'web') {
        files = await Promise.all(images.map(async (image, index) => {
          const response = await fetch(image);
          const blob = await response.blob();
          return new File([blob], `business_${businessId}_${Date.now()}_${index}.jpg`, { type: 'image/jpeg' });
        }));
      } else {
        files = images.map((image, index) => ({
          uri: image,
          name: `business_${businessId}_${Date.now()}_${index}.jpg`,
          type: 'image/jpeg',
        }));
      }

      const result = await uploadImages(files, parseInt(businessId));

      if (result.error) {
        Alert.alert('Error uploading images', result.error);
      } else {
        Alert.alert('Success', 'Images uploaded successfully');
        setImages([]);
      }
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      Alert.alert('Upload failed', 'An error occurred while uploading the images.');
    }
  };

  return (
      <ScrollView contentContainerStyle={{ ...styles.container, overflow: 'visible' }}>

      <Text style={styles.title}>Create Business</Text>
        <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
        />
        <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
        />
        <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
        />
        <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
        />
        <Text style={styles.subtitle}>Business Hours</Text>
        {businessHours.map((hour, index) => (
            <View key={index} style={styles.hourContainer}>
              <View style={styles.dayRow}>
                <Text style={styles.dayLabel}>{hour.day}</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Open:</Text>
                {Platform.OS === 'web' ? (
                    <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
                      <DatePicker
                          selected={new Date(`1970-01-01T${hour.open_time}:00`)}
                          onChange={(date) => handleTimeChange(index, 'open_time', date as Date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          portalId="root-portal"
                      />
                    </View>
                ) : (
                    <DateTimePicker
                        value={new Date(`1970-01-01T${hour.open_time}:00`)}
                        mode="time"
                        display="default"
                        onChange={(event, date) => date && handleTimeChange(index, 'open_time', date)}
                    />
                )}
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Close:</Text>
                {Platform.OS === 'web' ? (
                    <View style={styles.dropdownContainer}>
                      <DatePicker
                          selected={new Date(`1970-01-01T${hour.close_time}:00`)}
                          onChange={(date) => handleTimeChange(index, 'close_time', date as Date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                      />
                    </View>
                ) : (
                    <DateTimePicker
                        value={new Date(`1970-01-01T${hour.close_time}:00`)}
                        mode="time"
                        display="default"
                        onChange={(event, date) => date && handleTimeChange(index, 'close_time', date)}
                    />
                )}
              </View>
              <TouchableOpacity
                  style={styles.closedButton}
                  onPress={() => handleCloseDay(index)}
              >
                <Text style={styles.closedButtonText}>Closed</Text>
              </TouchableOpacity>
            </View>
        ))}
        <Text style={styles.subtitle}>Business Images</Text>
        <Button title="Pick images from camera roll" onPress={pickImages} />
        <ScrollView horizontal style={styles.imagePreview}>
          {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <Text>Image {index + 1}</Text>
              </View>
          ))}
        </ScrollView>
        <Button title="Create Business" onPress={handleCreateBusiness} disabled={loading || uploadLoading} />
        {(loading || uploadLoading) && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {upsertError && <Text style={styles.errorText}>{upsertError}</Text>}
        {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    color: '#000',
  },
  hourContainer: {
    marginBottom: 20,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closedButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  closedButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  dropdownContainer: {
    zIndex: 1000,
    position: 'relative',
  },
  imagePreview: {
    marginVertical: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 75,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});