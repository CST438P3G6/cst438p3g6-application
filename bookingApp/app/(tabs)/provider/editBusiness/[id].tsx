import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Button,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEditBusiness } from '@/hooks/useEditBusiness';
import { useViewBusinessImages } from '@/hooks/useViewBusinessImages';
import { useDeleteBusinessImage } from '@/hooks/useDeleteBusinessImage';
import { useAddBusinessImages } from '@/hooks/useAddBusinessImages';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/utils/supabase';
import { useViewBusinessHours } from '@/hooks/useViewBusinessHours';
import { useUpsertBusinessHours } from '@/hooks/useUpsertBusinessHours';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Business {
  id: string;
  name: string;
  description: string;
  phone_number: string;
  address: string;
  user_id: string;
  is_active: boolean;
  email: string;
}

type BusinessHour = {
  business_id: string;
  day: string;
  open_time: string;
  close_time: string;
};

interface Params {
  id: string;
}

export default function EditBusinessPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<Params>();
  const { editBusiness, loading: saveLoading } = useEditBusiness();
  const { deleteImage } = useDeleteBusinessImage();
  const { uploadImages, loading: uploadLoading, error: uploadError } = useAddBusinessImages();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business>({
    id: '',
    name: '',
    description: '',
    phone_number: '',
    address: '',
    user_id: '',
    is_active: true,
    email: '',
  });
  const { images, loading: imagesLoading, error: imagesError } = useViewBusinessImages(id);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const { businessHours, loading: hoursLoading, error: hoursError } = useViewBusinessHours(id);
  const { upsertBusinessHours, loading: upsertLoading, error: upsertError } = useUpsertBusinessHours();

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const [editableBusinessHours, setEditableBusinessHours] = useState<BusinessHour[]>(
      daysOfWeek.map((day) => ({
        business_id: id,
        day,
        open_time: '09:00',
        close_time: '17:00',
      }))
  );

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;

      const { data, error } = await supabase
          .from('business')
          .select('*')
          .eq('id', id)
          .single();

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch business',
          position: 'bottom',
          visibilityTime: 4000,
        });
        router.back();
        return;
      }

      setBusiness(data as Business);
      setLoading(false);
    };

    fetchBusiness();
  }, [id]);

  useEffect(() => {
    if (businessHours && businessHours.length > 0) {
      const updatedHours = daysOfWeek.map((day) => {
        const existing = businessHours.find((hour) => hour.day === day);
        return existing
            ? {
              ...existing,
              open_time: existing.open_time.slice(0, 5),
              close_time: existing.close_time.slice(0, 5),
            }
            : {
              business_id: id,
              day,
              open_time: '09:00',
              close_time: '17:00',
            };
      });
      setEditableBusinessHours(updatedHours);
    }
  }, [businessHours]);

  const isValidTime = (timeStr: string) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeStr);
  };

  const handleTimeChange = (index: number, field: 'open_time' | 'close_time', date: Date) => {
    const updatedHours = [...editableBusinessHours];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    updatedHours[index][field] = `${hours}:${minutes}`;
    setEditableBusinessHours(updatedHours);
  };

  const handleCloseDay = (index: number) => {
    const updatedHours = [...editableBusinessHours];
    updatedHours[index].open_time = '00:00';
    updatedHours[index].close_time = '00:00';
    setEditableBusinessHours(updatedHours);
  };

  const handleSaveBusinessHours = async () => {
    for (const hour of editableBusinessHours) {
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
          return { error: 'Invalid time for ' + hour.day };
        }
      }
    }

    const updatedHours = editableBusinessHours.map((hour) => ({
      ...hour,
      business_id: id,
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
      return { error: result.error };
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Business hours updated successfully',
        position: 'bottom',
        visibilityTime: 1000,
      });
      return { error: null };
    }
  };

  const handleSave = async () => {
    if (!business.name || !business.email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Name and email are required',
        position: 'bottom',
        visibilityTime: 4000,
      });
      return;
    }

    const result = await editBusiness(business);

    if (result.error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: result.error,
        position: 'bottom',
        visibilityTime: 4000,
      });
    } else {
      const hoursResult = await handleSaveBusinessHours();

      if (hoursResult.error) {
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Business updated successfully',
        position: 'bottom',
        visibilityTime: 4000,
      });

      for (const imageId of selectedImages) {
        const deleteResult = await deleteImage(parseInt(imageId));
        if (deleteResult.error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `Failed to delete image with ID ${imageId}`,
            position: 'bottom',
            visibilityTime: 4000,
          });
        }
      }

      if (newImages.length > 0) {
        let files;
        if (Platform.OS === 'web') {
          files = await Promise.all(
              newImages.map(async (image, index) => {
                const response = await fetch(image);
                const blob = await response.blob();
                return new File([blob], `business_${id}_${Date.now()}_${index}.jpg`, {
                  type: 'image/jpeg',
                });
              })
          );
        } else {
          files = newImages.map((image, index) => ({
            uri: image,
            name: `business_${id}_${Date.now()}_${index}.jpg`,
            type: 'image/jpeg',
          }));
        }

        const uploadResult = await uploadImages(files, parseInt(id));
        if (uploadResult.error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to upload new images',
            position: 'bottom',
            visibilityTime: 4000,
          });
        }
      }

      router.back();
    }
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prevSelectedImages) =>
        prevSelectedImages.includes(imageId)
            ? prevSelectedImages.filter((id) => id !== imageId)
            : [...prevSelectedImages, imageId]
    );
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
      setNewImages(result.assets.map((asset) => asset.uri));
    }
  };

  if (loading) {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
    );
  }

  return (
      <FlatList
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <View style={styles.content}>
              <Text style={styles.title}>Edit Business</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Name</Text>
                <TextInput
                    style={styles.input}
                    value={business.name}
                    onChangeText={(text) => setBusiness({ ...business, name: text })}
                    placeholder="Enter business name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={business.description}
                    onChangeText={(text) => setBusiness({ ...business, description: text })}
                    placeholder="Enter description"
                    multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={business.phone_number}
                    onChangeText={(text) => setBusiness({ ...business, phone_number: text })}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    value={business.address}
                    onChangeText={(text) => setBusiness({ ...business, address: text })}
                    placeholder="Enter address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={business.email}
                    onChangeText={(text) => setBusiness({ ...business, email: text })}
                    placeholder="Enter email"
                    keyboardType="email-address"
                />
              </View>

              <Text style={styles.subtitle}>Business Hours</Text>
              {hoursLoading || editableBusinessHours.length === 0 ? (
                  <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                  editableBusinessHours.map((hour, index) => {
                    const openTime = isValidTime(hour.open_time) ? hour.open_time : '09:00';
                    const closeTime = isValidTime(hour.close_time) ? hour.close_time : '17:00';

                    return (
                        <View key={index} style={styles.hourContainer}>
                          <View style={styles.dayRow}>
                            <Text style={styles.dayLabel}>{hour.day}</Text>
                          </View>
                          <View style={styles.timeRow}>
                            <Text style={styles.timeLabel}>Open:</Text>
                            {Platform.OS === 'web' ? (
                                <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
                                  <DatePicker
                                      selected={new Date(`1970-01-01T${openTime}:00`)}
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
                                    value={new Date(`1970-01-01T${openTime}:00`)}
                                    mode="time"
                                    display="default"
                                    onChange={(event, date) => date && handleTimeChange(index, 'open_time', date)}
                                />
                            )}
                          </View>
                          <View style={[styles.timeRow, { zIndex: 1001 }]}>
                            <Text style={styles.timeLabel}>Close:</Text>
                            {Platform.OS === 'web' ? (
                                <View style={[styles.dropdownContainer, { zIndex: 1001 }]}>
                                  <DatePicker
                                      selected={new Date(`1970-01-01T${closeTime}:00`)}
                                      onChange={(date) => handleTimeChange(index, 'close_time', date as Date)}
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
                                    value={new Date(`1970-01-01T${closeTime}:00`)}
                                    mode="time"
                                    display="default"
                                    onChange={(event, date) => date && handleTimeChange(index, 'close_time', date)}
                                />
                            )}
                          </View>
                          <TouchableOpacity style={styles.closedButton} onPress={() => handleCloseDay(index)}>
                            <Text style={styles.closedButtonText}>Closed</Text>
                          </TouchableOpacity>
                        </View>
                    );
                  })
              )}
              {hoursError && <Text style={styles.errorText}>{hoursError}</Text>}

              <Text style={styles.subtitle}>Business Images</Text>
              {imagesLoading && <ActivityIndicator size="large" color="#0000ff" />}
              {imagesError && <Text style={styles.errorText}>{imagesError}</Text>}
            </View>
          }
          data={images.concat(newImages)}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image_url || item }} style={styles.image} resizeMode="contain" />
              </View>
          )}
          ListFooterComponent={
            <View>
              <Button title="Add Images" onPress={pickImages} />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
                    disabled={saveLoading || uploadLoading || upsertLoading}
                >
                  <Save size={20} color="white" />
                  <Text style={styles.buttonText}>
                    {saveLoading || uploadLoading || upsertLoading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
                  <ArrowLeft size={20} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
      />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 15,
  },
  selectedImageContainer: {
    borderColor: 'red',
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
});
