import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useCreateBusiness } from '@/hooks/useCreateBusiness';
import { useUpsertBusinessHours } from '@/hooks/useUpsertBusinessHours';
import Toast from 'react-native-toast-message';

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

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

export default function CreateBusiness() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { createBusiness, loading, error } = useCreateBusiness();
  const { upsertBusinessHours, loading: upsertLoading, error: upsertError } = useUpsertBusinessHours();
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(
      daysOfWeek.map((day) => ({
        business_id: '',
        day,
        open_time: '09:00',
        close_time: '17:00',
      }))
  );

  const handleTimeChange = (index: number, field: 'open_time' | 'close_time', hour: string, minute: string) => {
    const updatedHours = [...businessHours];
    updatedHours[index][field] = `${hour}:${minute}`;
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

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Business</Text>
        <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
        />
        <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
        />
        <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
        />
        <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
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
                <Picker
                    selectedValue={hour.open_time.split(':')[0] || '09'}
                    onValueChange={(value) =>
                        handleTimeChange(index, 'open_time', value, hour.open_time.split(':')[1] || '00')
                    }
                    style={styles.picker}
                >
                  {hours.map((h) => (
                      <Picker.Item key={h} label={h} value={h} />
                  ))}
                </Picker>
                <Text>:</Text>
                <Picker
                    selectedValue={hour.open_time.split(':')[1] || '00'}
                    onValueChange={(value) =>
                        handleTimeChange(index, 'open_time', hour.open_time.split(':')[0] || '09', value)
                    }
                    style={styles.picker}
                >
                  {minutes.map((m) => (
                      <Picker.Item key={m} label={m} value={m} />
                  ))}
                </Picker>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Close:</Text>
                <Picker
                    selectedValue={hour.close_time.split(':')[0] || '17'}
                    onValueChange={(value) =>
                        handleTimeChange(index, 'close_time', value, hour.close_time.split(':')[1] || '00')
                    }
                    style={styles.picker}
                >
                  {hours.map((h) => (
                      <Picker.Item key={h} label={h} value={h} />
                  ))}
                </Picker>
                <Text>:</Text>
                <Picker
                    selectedValue={hour.close_time.split(':')[1] || '00'}
                    onValueChange={(value) =>
                        handleTimeChange(index, 'close_time', hour.close_time.split(':')[0] || '17', value)
                    }
                    style={styles.picker}
                >
                  {minutes.map((m) => (
                      <Picker.Item key={m} label={m} value={m} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                  style={styles.closedButton}
                  onPress={() => handleCloseDay(index)}
              >
                <Text style={styles.closedButtonText}>Closed</Text>
              </TouchableOpacity>
            </View>
        ))}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {upsertError && <Text style={styles.errorText}>{upsertError}</Text>}
        {upsertLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <Button title="Create Business" onPress={handleCreateBusiness} />
        )}
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
  picker: {
    width: 70,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});